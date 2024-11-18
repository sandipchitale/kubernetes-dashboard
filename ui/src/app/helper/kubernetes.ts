import {v1} from "@docker/extension-api-client-types";

export const checkK8sConnection = async (ddClient: v1.DockerDesktopClient) => {
    try {
        ddClient.desktopUI.toast.success('Connecting to Kubernetes');
        const output = await ddClient.extension.host?.cli.exec("kubectl", [
            "cluster-info",
            "--request-timeout",
            "2s",
        ]);
        console.log(output);
        if (output?.stderr) {
            ddClient.desktopUI.toast.error(`Connection failed. ${output.stderr}`);
            console.log(output.stderr);
            return 'Connection failed';
        }
        ddClient.desktopUI.toast.success('Connection successful');
        return 'Connection successful';
    } catch (e: any) {
        ddClient.desktopUI.toast.error(`Connection failed. ${e}`);
        console.log("Connection failed.", e);
        return 'Connection failed';
    }
};

export const primeCluster = async (ddClient: v1.DockerDesktopClient) => {
    const os = ddClient.host.platform;
    const kubectlDir = (os === 'win32' ?
        "..\\..\\Roaming\\Docker\\extensions\\sandipchitale_kubernetes-dashboard\\ui\\ui\\kubectl" :
        "./extensions/sandipchitale_kubernetes-dashboard/ui/ui/kubectl");
    try {
        ddClient.desktopUI.toast.success('Priming cluster for Kubernetes Dashboard. Creating namespace, service account, Cluster Role Binding, and secret');
        const output = await ddClient.extension.host?.cli.exec("kubectl", [
            "apply",
            "-f",
            kubectlDir,
        ])
        console.log(output);
        if (output?.stderr) {
            ddClient.desktopUI.toast.error('Priming cluster failed');
            console.log(output.stderr);
            return 'Priming cluster failed';
        }
        ddClient.desktopUI.toast.success('Created namespace, service account, Cluster Role Binding, and secret successfully.');
        return output?.stdout;
    } catch (e) {
        ddClient.desktopUI.toast.error(`Priming cluster failed. ${e}`);
        console.log("Priming cluster failed.", e);
        return 'Priming cluster failed.';
    }
};

export const getToken = async (ddClient: v1.DockerDesktopClient) => {
    try {
        ddClient.desktopUI.toast.success('Getting token');
        const output = await ddClient.extension.host?.cli.exec("kubectl", [
            "get",
            "secret",
            "-n",
            "kubernetes-dashboard",
            "admin-user-secret",
            "-o",
            "jsonpath={.data.token}",
        ])
        console.log(output);
        if (output?.stderr) {
            ddClient.desktopUI.toast.error(`Getting token failed. ${output.stderr}`);
            console.log(output.stderr);
            return 'Getting token failed.';
        }
        ddClient.desktopUI.toast.success('Got token successfully and copied to clipboard. Load Kubernetes Dashboard and paste it in Bearer token * box.');
        return window.atob(output?.stdout as string);
    } catch (e) {
        ddClient.desktopUI.toast.error(`Getting token failed. ${e}`);
        console.log("Getting token failed.", e);
        return 'Getting token failed.';
    }

};

export const portForward = async (ddClient: v1.DockerDesktopClient) => {
    try {
        ddClient.desktopUI.toast.success('Forwarding Port');
        ddClient.extension.host?.cli.exec("kubectl", [
            "port-forward",
            "-n",
            "kubernetes-dashboard",
            "service/kubernetes-dashboard-kong-proxy",
            "8443:443",
        ]).then((output: { stderr: any; stdout: any; }) => {
            console.log(output);
            if (output?.stderr) {
                ddClient.desktopUI.toast.error(`Forwarding Port failed. ${output.stderr}`);
                return output.stderr;
            }
            ddClient.desktopUI.toast.success('Port Forwarded');
            return output?.stdout;
        });
        return 'Port Forwarded';
    } catch (e) {
        ddClient.desktopUI.toast.error(`Forwarding Port failed. ${e}`);
        console.log("Forwarding Port failed.", e);
        return 'Forwarding Port failed.';
    }
};

export const deprimeCluster = async (ddClient: v1.DockerDesktopClient) => {
    const os = ddClient.host.platform;
    const kubectlDir = (os === 'win32' ?
        "..\\..\\Roaming\\Docker\\extensions\\sandipchitale_kubernetes-dashboard\\ui\\ui\\kubectl" :
        "./extensions/sandipchitale_kubernetes-dashboard/ui/ui/kubectl");
    try {
        ddClient.desktopUI.toast.success('Depriming cluster for Kubernetes Dashboard. Deleting service account, Cluster Role Binding, and secret');
        const output = await ddClient.extension.host?.cli.exec("kubectl", [
            "delete",
            "-f",
            kubectlDir,
        ])
        console.log(output);
        if (output?.stderr) {
            ddClient.desktopUI.toast.error(`Depriming cluster failed. ${output.stderr}`);
            console.log(output.stderr);
            return 'Depriming cluster failed';
        }
        ddClient.desktopUI.toast.success('Deleted service account, Cluster Role Binding, and secret successfully.');
        return output?.stdout;
    } catch (e) {
        ddClient.desktopUI.toast.error(`Depriming cluster failed. ${e}`);
        console.log("Depriming cluster failed.", e);
        return 'Depriming cluster failed.';
    }
};
