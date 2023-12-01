import { Layout } from "../../components/Layout";
import { useAuthStore } from "../../stores/auth.store";
import { Box, Typography, Container, Grid } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import UserIcon from "@mui/icons-material/Person";
import EventIcon from "@mui/icons-material/Event";
import CellIcon from "@mui/icons-material/GroupWork";
import NewsIcon from "@mui/icons-material/Public";
import WordIcon from "@mui/icons-material/TextSnippet";
import {useEffect, useState} from "react";
import api from "../../services/api.ts";

export const DashboardPage = () => {  const [counts, setCounts] = useState({
    users: 0,
    events: 0,
    groups: 0,
    news: 0,
    wordSermons: 0,
});

    const authStore = useAuthStore();
    const user = authStore.getUser();
    const theme = useTheme();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const usersResponse = await api.get("/user");
                const eventsResponse = await api.get("/event");
                const groupsResponse = await api.get("/group");
                const newsResponse = await api.get("/news");
                const wordSermonsResponse = await api.get("/wordSermon");

                setCounts({
                    users: usersResponse.data.count,
                    events: eventsResponse.data.count,
                    groups: groupsResponse.data.count,
                    news: newsResponse.data.count,
                    wordSermons: wordSermonsResponse.data.count,
                });
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
    }, []); // eslint-disable-line react-hooks/exhaustive-deps
    return (
        <>
            <Layout>
                <Container>
                    <Box
                        sx={{
                            my: 5,
                            display: "flex",
                            alignItems: "center",
                        }}
                    >
                        <UserIcon />
                        <Typography
                            component="h1"
                            variant="h4"
                            sx={{ ml: 2 }}
                        >
                            Olá, {user.name}
                        </Typography>
                    </Box>
                    <Grid container spacing={3}>
                        <Grid item xs={12} sm={6} md={3}>
                            <Box
                                sx={{
                                    p: 3,
                                    backgroundColor: "#1b1b1f",
                                    borderRadius: 2,
                                    boxShadow: theme.shadows[1],
                                }}
                            >
                                <UserIcon color="primary" sx={{ mb: 2 }} />
                                <Typography component="h2" variant="h6" sx={{ mb: 1 }}>
                                    Usuários
                                </Typography>
                                <Typography>{counts.users}</Typography>
                            </Box>
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                            <Box
                                sx={{
                                    p: 3,
                                    backgroundColor: "#1b1b1f",
                                    borderRadius: 2,
                                    boxShadow: theme.shadows[1],
                                }}
                            >
                                <EventIcon color="primary" sx={{ mb: 2 }} />
                                <Typography component="h2" variant="h6" sx={{ mb: 1 }}>
                                    Eventos
                                </Typography>
                                <Typography>{counts.events}</Typography>
                            </Box>
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                            <Box
                                sx={{
                                    p: 3,
                                    backgroundColor: "#1b1b1f",
                                    borderRadius: 2,
                                    boxShadow: theme.shadows[1],
                                }}
                            >
                                <CellIcon color="primary" sx={{ mb: 2 }} />
                                <Typography component="h2" variant="h6" sx={{ mb: 1 }}>
                                    Células
                                </Typography>
                                <Typography>{counts.groups}</Typography>
                            </Box>
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                            <Box
                                sx={{
                                    p: 3,
                                    backgroundColor: "#1b1b1f",
                                    borderRadius: 2,
                                    boxShadow: theme.shadows[1],
                                }}
                            >
                                <NewsIcon color="primary" sx={{ mb: 2 }} />
                                <Typography component="h2" variant="h6" sx={{ mb: 1 }}>
                                    Notícias
                                </Typography>
                                <Typography>{counts.news}</Typography>
                            </Box>
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                            <Box
                                sx={{
                                    p: 3,
                                    backgroundColor: "#1b1b1f",
                                    borderRadius: 2,
                                    boxShadow: theme.shadows[1],
                                }}
                            >
                                <WordIcon color="primary" sx={{ mb: 2 }} />
                                <Typography component="h2" variant="h6" sx={{ mb: 1 }}>
                                    Palavras
                                </Typography>
                                <Typography>{counts.wordSermons}</Typography>
                            </Box>
                        </Grid>
                    </Grid>
                </Container>
            </Layout>
        </>
    );
};