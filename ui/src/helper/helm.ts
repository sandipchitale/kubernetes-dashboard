import { v1 } from "@docker/extension-api-client-types";

export const listHelmReleases = async (ddClient: v1.DockerDesktopClient) => {
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
};

export const installKubernetesDashboardChart = async (ddClient: v1.DockerDesktopClient) => {
  ddClient.desktopUI.toast.success('Installing Kubernetes Dashboard Helm Chart');
  const output = await ddClient.extension.host?.cli.exec("helm", [
    "install",
    "-n",
    "kubernetes-dashboard",
    "kubernetes-dashboard",
    "./extensions/sandipchitale_kubernetes-dashboard//ui/ui/chart/kubernetes-dashboard.tgz",
  ]);
  console.log(output);
  if (output?.stderr) {
    console.log(output.stderr);
    return output.stderr;
  }
  ddClient.desktopUI.toast.success('Kubernetes Dashboard Helm Chart installed');
  return output?.stdout;
};

export const uninstallKubernetesDashboardChart = async (ddClient: v1.DockerDesktopClient) => {
  ddClient.desktopUI.toast.success('Uninstalling Kubernetes Dashboard');
  const output = await ddClient.extension.host?.cli.exec("helm", [
    "uninstall",
    "-n",
    "kubernetes-dashboard",
    "kubernetes-dashboard",
  ]);
  console.log(output);
  if (output?.stderr) {
    console.log(output.stderr);
    return output.stderr;
  }
  ddClient.desktopUI.toast.success('Kubernetes Dashboard uninstalled');
  return output?.stdout;
};


