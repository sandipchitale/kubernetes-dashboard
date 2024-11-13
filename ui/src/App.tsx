import React from 'react';
import {createDockerDesktopClient} from '@docker/extension-api-client';
import {Button, Stack, TextField, Typography} from '@mui/material';


// Note: This line relies on Docker Desktop's presence as a host application.
// If you're running this React app in a browser, it won't work properly.
const client = createDockerDesktopClient();

function useDockerDesktopClient() {
    return client;
}

export function App() {
    const [href, setHref] = React.useState<string>();
    const ddClient = useDockerDesktopClient();
    const goto = async () => {
        // @ts-ignore
        setHref((document.getElementById('href') as HTMLInputElement).value);
    };
    return (
        <>
            <Typography variant="h3">Kubernetes Dashboard</Typography>
            <Stack direction="row" alignItems="start" spacing={2} sx={{mt: 4}}>
                <input
                    id="href"
                    type="text">
                </input>
                <Button variant="contained" onClick={goto}>Load</Button>
            </Stack>
            <Stack direction="row" alignItems="start" spacing={2} sx={{mt: 4}}>
                <iframe width="480" height="300" src={href ?? ''}/>
            </Stack>
        </>
    );
}
