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
            ddClient.desktopUI.toast.error('Connection failed');
            console.log(output.stderr);
            return 'Connection failed';
        }
        ddClient.desktopUI.toast.success('Connection successful');
        return 'Connection successful';
    } catch (e: any) {
        console.log("[checkK8sConnection] error : ", e);
        return 'Connection failed';
    }
};

export const portForward = async (ddClient: v1.DockerDesktopClient) => {
    ddClient.desktopUI.toast.success('Forwarding Port');
    ddClient.extension.host?.cli.exec("kubectl", [
        "port-forward",
        "-n",
        "kubernetes-dashboard",
        "service/kubernetes-dashboard-kong-proxy",
        "8443:443",
    ]).then((output: { stderr: any; stdout: any; }) => {
        ddClient.desktopUI.toast.success('Port Forwarded');
        console.log(output);
        if (output?.stderr) {
            return output.stderr;
        }
        return output?.stdout;
    });
};

