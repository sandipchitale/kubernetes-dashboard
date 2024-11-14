import React from "react";
import Button from "@mui/material/Button";
import {createDockerDesktopClient} from "@docker/extension-api-client";
import {Grid, Stack, TextField, Typography} from "@mui/material";
import {
    checkK8sConnection,
    getToken,
    portForward,
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
                Install Kubernetes Dashboard Helm chart, forward port, load Kubernetes Dashboard, uninstall Kubernetes
                Dashboard Helm chart.
            </Typography>
            <Grid container spacing={2}>
                <Grid item>
                    <Stack direction="row" alignItems="start" spacing={2} sx={{mt: 4}}>
                        <Button
                            variant="contained"
                            onClick={async () => {
                                const result = await checkK8sConnection(ddClient);
                                setResponse(result);
                            }}
                        >
                            Check Kubernetes connection
                        </Button>

                        <Button
                            variant="contained"
                            onClick={async () => {
                                const result = await listHelmReleases(ddClient);
                                setResponse(result as string);
                            }}
                        >
                            List Helm Releases
                        </Button>

                        <Button
                            variant="contained"
                            onClick={async () => {
                                const result = await installKubernetesDashboardChart(ddClient);
                                setResponse(result as string);
                            }}
                        >
                            Install kubernetes dashboard chart
                        </Button>

                        <Button
                            variant="contained"
                            onClick={async () => {
                                await portForward(ddClient);
                                setResponse('Port Forwarding started');
                            }}
                        >
                            Port Forward
                        </Button>

                        <Button
                            variant="contained"
                            onClick={async () => {
                                const result = await getToken(ddClient);
                                setResponse(result as string);
                            }}
                        >
                            Get Token
                        </Button>

                        <Button
                            variant="contained"
                            onClick={async () => {
                                const result = await loadKubernetesDashboard();
                            }}
                        >
                            Load Kubernetes Dashboard
                        </Button>



                        <Button
                            variant="contained"
                            onClick={async () => {
                                const result = await uninstallKubernetesDashboardChart(ddClient);
                                setResponse(result as string);
                            }}
                        >
                            Uninstall kubernetes dashboard
                        </Button>

                    </Stack>
                </Grid>
                <Grid item>
                    <TextField
                        label="Output"
                        sx={{width: '90vw'}}
                        disabled
                        multiline
                        variant="outlined"
                        minRows={20}
                        value={response ?? ""}
                    />
                </Grid>
            </Grid>
        </>
    );
}
