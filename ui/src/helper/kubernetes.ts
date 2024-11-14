import {v1} from "@docker/extension-api-client-types";

export const checkK8sConnection = async (ddClient: v1.DockerDesktopClient) => {
    try {
        let output = await ddClient.extension.host?.cli.exec("kubectl", [
            "cluster-info",
            "--request-timeout",
            "2s",
        ]);
        console.log(output);
        if (output?.stderr) {
            console.log(output.stderr);
            return "false";
        }
        return "true";
    } catch (e: any) {
        console.log("[checkK8sConnection] error : ", e);
        return "false";
    }
};

export const portForward = async (ddClient: v1.DockerDesktopClient) => {
    ddClient.extension.host?.cli.exec("kubectl", [
        "port-forward",
        "-n",
        "kubernetes-dashboard",
        "service/kubernetes-dashboard-kong-proxy",
        "8443:443",
    ]).then((output: { stderr: any; stdout: any; }) => {
        console.log(output);
        if (output?.stderr) {
            return output.stderr;
        }
        return output?.stdout;
    });

};

