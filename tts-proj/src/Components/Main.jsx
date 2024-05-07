import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Speech from 'speak-tts';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import IconButton from '@mui/material/IconButton';
import { useNavigate } from 'react-router-dom';
import { getDatabase, ref, push } from "firebase/database";

const MainPage = ({ openaiApiKey }) => {
    const [prompt, setPrompt] = useState('');
    const [submittedPrompt, setSubmittedPrompt] = useState('');
    const [promptList, setPromptList] = useState([]);
    const navigate = useNavigate();

    const speech = new Speech();

    const handleTextToSpeech = () => {
        if (prompt.trim() === '') {
            return;
        }

        const newPromptList = [prompt, ...promptList];
        setPromptList(newPromptList);
        setSubmittedPrompt(prompt);

        const userEmail = localStorage.getItem('email');

        const db = getDatabase();
        const promptsRef = ref(db, 'prompts');
        push(promptsRef, {
            prompt: prompt,
            userEmail: userEmail
        });

        speech
            .init()
            .then((data) => {
                speech.speak({
                    text: prompt,
                    queue: false,
                });
            })
            .catch((error) => {
                console.error("Couldn't initialize speech synthesis: ", error);
            });

        setPrompt('');
    };

    const handleLogout = () => {
        localStorage.removeItem('email');
        navigate('/login');
    };

    return (
        <Grid container justifyContent="center" alignItems="flex-end" style={{ minHeight: '100vh' }}>
            <IconButton
                onClick={handleLogout}
                style={{ position: 'fixed', top: 10, right: 10, zIndex: 999 }}
            >
                <ExitToAppIcon />
            </IconButton>
            <Grid item xs={12} sm={8} md={6} lg={4} sx={{ marginBottom: '20px' }}>
                {promptList.map((prompt, index) => (
                    <Typography variant="body1" gutterBottom key={index}>
                        {prompt}
                    </Typography>
                ))}
                <TextField
                    label="Prompt"
                    multiline
                    rows={4}
                    variant="outlined"
                    fullWidth
                    sx={{ '& .MuiOutlinedInput-root': { height: '100px' } }}
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                />
                <Button variant="contained" color="primary" onClick={handleTextToSpeech} fullWidth sx={{ marginTop: '10px' }}>
                    Submit
                </Button>
            </Grid>
        </Grid>
    );
};

export { MainPage };
