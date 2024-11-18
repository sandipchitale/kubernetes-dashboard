import {v1} from "@docker/extension-api-client-types";

export const listHelmReleases = async (ddClient: v1.DockerDesktopClient) => {
    try {
        ddClient.desktopUI.toast.success('Listing helm releases.');
        const output = await ddClient.extension.host?.cli.exec("helm", [
            "list",
            "-n",
            "kubernetes-dashboard",
        ]);
        console.log(output);
        if (output?.stderr) {
            console.log(output.stderr);
            return output.stderr;
        }
        return output?.stdout;
    } catch (e: any) {
        ddClient.desktopUI.toast.error(`Listing helm releases failed. ${e}`);
        console.log("Listing helm releases failed.", e);
        return 'Listing helm releases failed.';
    }
};

export const installKubernetesDashboardChart = async (ddClient: v1.DockerDesktopClient) => {
    const os = ddClient.host.platform;
    const tgz = (os === 'win32' ?
        "..\\..\\Roaming\\Docker\\extensions\\sandipchitale_kubernetes-dashboard\\ui\\ui\\chart\\kubernetes-dashboard.tgz" :
        "./extensions/sandipchitale_kubernetes-dashboard/ui/ui/chart/kubernetes-dashboard.tgz");
    try {
        ddClient.desktopUI.toast.success('Installing Kubernetes Dashboard Helm chart.');
        const output = await ddClient.extension.host?.cli.exec("helm", [
            "install",
            "-n",
            "kubernetes-dashboard",
            "kubernetes-dashboard",
            tgz,
        ]);
        console.log(output);
        if (output?.stderr) {
            ddClient.desktopUI.toast.error(`Installation of Kubernetes Dashboard Helm chart failed. ${output.stderr}`);
            console.log(output.stderr);
            return output.stderr;
        }
        ddClient.desktopUI.toast.success('Kubernetes Dashboard Helm Chart installed');
        return output?.stdout;
    } catch (e: any) {
        ddClient.desktopUI.toast.error(`Installation of Kubernetes Dashboard Helm chart failed. ${e}`);
        console.log("Installation of Kubernetes Dashboard Helm chart failed.", e);
        return 'Installation of Kubernetes Dashboard Helm chart failed.';
    }
};

export const uninstallKubernetesDashboardChart = async (ddClient: v1.DockerDesktopClient) => {
    try {
        ddClient.desktopUI.toast.success('Uninstalling Kubernetes Dashboard');
        const output = await ddClient.extension.host?.cli.exec("helm", [
            "uninstall",
            "-n",
            "kubernetes-dashboard",
            "kubernetes-dashboard",
        ]);
        console.log(output);
        if (output?.stderr) {
            ddClient.desktopUI.toast.error(`Uninstallation of Kubernetes Dashboard failed. ${output.stderr}`);
            console.log(output.stderr);
            return output.stderr;
        }
        ddClient.desktopUI.toast.success('Kubernetes Dashboard uninstalled.');
        return output?.stdout;

    } catch (e: any) {
        ddClient.desktopUI.toast.error(`Uninstallation of Kubernetes Dashboard failed. ${e}`);
        console.log("Uninstallation of Kubernetes Dashboard failed.", e);
        return 'Uninstallation of Kubernetes Dashboard failed.';
    }
};


