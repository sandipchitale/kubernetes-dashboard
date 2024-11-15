import React from "react";
import Button from "@mui/material/Button";
import {createDockerDesktopClient} from "@docker/extension-api-client";
import {Grid, Stack, TextField, Typography} from "@mui/material";
import {
    checkK8sConnection,
    primeCluster,
    getToken,
    portForward,
    deprimeCluster,
} from "./helper/kubernetes";

import {
    listHelmReleases,
    installKubernetesDashboardChart,
    uninstallKubernetesDashboardChart,
} from "./helper/helm";

// Note: This line relies on Docker Desktop's presence as a host application.
// If you're running this React app in a browser, it won't work properly.
const client = createDockerDesktopClient();

function useDockerDesktopClient() {
    return client;
}

export function App() {
    const [response, setResponse] = React.useState<string | undefined>();
    const ddClient = useDockerDesktopClient();

    async function loadKubernetesDashboard() {
        window.location.href = "http://localhost:3000";
    }

    return (
        <>
            <Typography variant="h3">Kuberntes Dashboard Extension</Typography>
            <Typography variant="body1" color="text.secondary" sx={{mt: 2}}>
                Prime cluster for Kubernetes Dashboard.
                Install Kubernetes Dashboard Helm chart.
                Forward port.
                Get token.
                Load Kubernetes Dashboard.
                Optionally, uninstall Kubernetes Dashboard Helm release.
            </Typography>
            <Grid container spacing={2}>
                <Grid item>
                    <Stack direction="row" alignItems="start" spacing={2} sx={{mt: 4}}>
                        <Button
                            color="info"
                            variant="contained"
                            onClick={async () => {
                                const result = await checkK8sConnection(ddClient);
                                setResponse(result);
                            }}
                        >
                            Check connection to Cluster
                        </Button>
                        <Button
                            color="info"
                            variant="contained"
                            onClick={async () => {
                                const result = await listHelmReleases(ddClient);
                                setResponse(result as string);
                            }}
                        >
                            List Kubernetes Dashboard Helm Release
                        </Button>
                    </Stack>
                    <Stack direction="row" alignItems="start" spacing={2} sx={{mt: 4}}>
                        <Button
                            variant="contained"
                            onClick={async () => {
                                const result = await primeCluster(ddClient);
                                setResponse(result);
                            }}
                        >
                            Step 1: Prime cluster
                        </Button>
                        <Button
                            variant="contained"
                            onClick={async () => {
                                const result = await installKubernetesDashboardChart(ddClient);
                                setResponse(result as string);
                            }}
                        >
                            Step 2: Install kubernetes dashboard chart
                        </Button>

                        <Button
                            variant="contained"
                            onClick={async () => {
                                await portForward(ddClient);
                                setResponse('Port Forwarding started');
                            }}
                        >
                            Step 3: Port Forward
                        </Button>

                        <Button
                            variant="contained"
                            onClick={async () => {
                                const result = await getToken(ddClient);
                                setResponse(result as string);
                                navigator.clipboard.writeText(result);
                            }}
                        >
                            Step 4: Get Token
                        </Button>

                        <Button
                            variant="contained"
                            onClick={async () => {
                                const result = await loadKubernetesDashboard();
                            }}
                        >
                            Step 5: Load Kubernetes Dashboard
                        </Button>
                    </Stack>
                </Grid>
                <Grid item>
                    <TextField
                        sx={{width: '94vw'}}
                        disabled
                        multiline
                        variant="outlined"
                        minRows={20}
                        value={response ?? ""}
                    />
                </Grid>
                <Grid item>
                    <Stack direction="row" alignItems="start" spacing={2} sx={{mt: 4}}>
                        <Button
                            color="error"
                            variant="contained"
                            onClick={async () => {
                                const result = await uninstallKubernetesDashboardChart(ddClient);
                                setResponse(result as string);
                            }}
                        >
                            Cleanup Step 1: Uninstall Kubernetes Dashboard
                        </Button>

                        <Button
                            color="error"
                            variant="contained"
                            onClick={async () => {
                                const result = await deprimeCluster(ddClient);
                                setResponse(result);
                            }}
                        >
                            Cleanup Step 2: Deprime cluster
                        </Button>
                    </Stack>
                </Grid>
            </Grid>
        </>
    );
}
