import React, { useState, useEffect } from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Speech from 'speak-tts';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import { useNavigate } from 'react-router-dom';
import { getOpenAIResponse } from '../Service/openaiService.js';
import { deletePrompt } from '../Service/promptService.js';
import { getDatabase, onValue, push, ref, remove } from "firebase/database";

const PromptList = ({ userEmail, updatePromptList }) => {
    const [prompts, setPrompts] = useState([]);

    useEffect(() => {
        const db = getDatabase();
        const promptsRef = ref(db, 'prompts');

        onValue(promptsRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                const userPrompts = Object.entries(data).filter(([key, value]) => value.userEmail === userEmail).map(([key, value]) => ({ ...value, id: key }));
                setPrompts(userPrompts);
            } else {
                setPrompts([]);
            }
        });

    }, [userEmail, updatePromptList]);

    const handleDeletePrompt = (id) => {
        const db = getDatabase();
        const promptRef = ref(db, `prompts/${id}`);
        remove(promptRef);
    };

    return (
        <div style={{ position: 'fixed', left: 0, top: 0, bottom: 0, width: '200px', padding: '20px', overflowY: 'auto', backgroundColor: '#f0f0f0', borderRight: '1px solid #ccc' }}>
            <Typography variant="h6" gutterBottom>History</Typography>
            {prompts.map((prompt, index) => (
                <div key={prompt.id} style={{ display: 'flex', alignItems: 'center' }}>
                    <Typography variant="body1" gutterBottom style={{ flex: 1 }}>
                        {<><strong>Question:</strong> {prompt.question}</>}
                    </Typography>
                    <IconButton onClick={() => handleDeletePrompt(prompt.id)} aria-label="delete">
                        <DeleteIcon />
                    </IconButton>
                </div>
            ))}
        </div>
    );
};

const MainPage = ({ openaiApiKey }) => {
    const [prompt, setPrompt] = useState('');
    const [response, setResponse] = useState('');
    const [updatePromptList, setUpdatePromptList] = useState(false);
    const navigate = useNavigate();

    const speech = new Speech();

    const userEmail = localStorage.getItem('email');

    const handleTextToSpeech = async () => {
        if (prompt.trim() === '') {
            return;
        }

        try {
            const response = await getOpenAIResponse(prompt);
            console.log('Response:', response);

            setResponse(response);

            const db = getDatabase();
            const promptsRef = ref(db, 'prompts');
            push(promptsRef, {
                question: prompt,
                response,
                userEmail: userEmail
            });

            speech
                .init()
                .then(() => {
                    speech.speak({
                        text: response,
                        queue: false,
                    });
                })
                .catch((error) => {
                    console.error("Couldn't initialize speech synthesis: ", error);
                });

            setPrompt('');
            setUpdatePromptList(prevState => !prevState);
        } catch (error) {
            console.error('Error fetching response:', error);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('email');
        navigate('/login');
    };

    return (
        <div>
            <PromptList userEmail={userEmail} updatePromptList={updatePromptList} />
            <Grid container justifyContent="center" alignItems="flex-end" style={{ minHeight: '100vh', marginLeft: '200px', overflowX: 'hidden' }}>
                <IconButton
                    onClick={handleLogout}
                    style={{ position: 'fixed', top: 10, right: 10, zIndex: 999 }}
                >
                    <ExitToAppIcon />
                </IconButton>
                <Grid item xs={12} sm={8} md={6} lg={4} sx={{ marginBottom: '20px' }}>
                    <Typography variant="h6" gutterBottom>Ask a Question</Typography>
                    {response && (
                        <Typography variant="body1" gutterBottom>
                            <strong>Response:</strong> {response}
                        </Typography>
                    )}
                    <TextField
                        label="Question"
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
        </div>
    );
};

export { MainPage };
