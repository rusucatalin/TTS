import React, { useState } from "react";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { TextField, Button, Container, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { getDatabase, ref, get, child } from "firebase/database";

const LoginPage = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleSignIn = () => {
        const auth = getAuth();
        const db = getDatabase();
        const usersRef = ref(db, 'users');

        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                const user = userCredential.user;
                console.log("Sign in successful");

                localStorage.setItem('email', email);

                navigate("/");
            })
            .catch((error) => {
                setError(error.message);
            });

        get(child(usersRef, email.replace(/\./g, '-')))
            .then((snapshot) => {
                if (snapshot.exists()) {
                } else {
                    setError("Invalid email or password");
                }
            })
            .catch((error) => {
                console.error("Error getting user data:", error);
            });
    };

    return (
        <Container maxWidth="xs">
            <Typography variant="h4" align="center" gutterBottom>
                Sign In
            </Typography>
            {error && (
                <Typography variant="body2" color="error" align="center">
                    {error}
                </Typography>
            )}
            <TextField
                label="Email"
                variant="outlined"
                fullWidth
                margin="normal"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            <TextField
                label="Password"
                type="password"
                variant="outlined"
                fullWidth
                margin="normal"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <Button
                variant="contained"
                color="primary"
                fullWidth
                onClick={handleSignIn}>
                Sign In
            </Button>
        </Container>
    );
};

export { LoginPage };
