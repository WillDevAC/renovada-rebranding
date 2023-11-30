import { Layout } from "../../components/Layout";
import { useAuthStore } from "../../stores/auth.store";
import { Box, Typography, Container, Grid } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import UserIcon from "@mui/icons-material/Person";
import EventIcon from "@mui/icons-material/Event";
import CellIcon from "@mui/icons-material/GroupWork";
import NewsIcon from "@mui/icons-material/Public";
import WordIcon from "@mui/icons-material/TextSnippet";

export const DashboardPage = () => {
    const authStore = useAuthStore();
    const user = authStore.getUser();
    const theme = useTheme();

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
                                    backgroundColor: "#1b1b1f",                                    borderRadius: 2,
                                    boxShadow: theme.shadows[1],
                                }}
                            >
                                <UserIcon color="primary" sx={{ mb: 2 }} />
                                <Typography component="h2" variant="h6" sx={{ mb: 1 }}>
                                    Usuários
                                </Typography>
                                <Typography>10</Typography>
                            </Box>
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                            <Box
                                sx={{
                                    p: 3,
                                    backgroundColor: "#1b1b1f",                                    borderRadius: 2,
                                    boxShadow: theme.shadows[1],
                                }}
                            >
                                <EventIcon color="primary" sx={{ mb: 2 }} />
                                <Typography component="h2" variant="h6" sx={{ mb: 1 }}>
                                    Eventos
                                </Typography>
                                <Typography>10</Typography>
                            </Box>
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                            <Box
                                sx={{
                                    p: 3,
                                    backgroundColor: "#1b1b1f",                                    borderRadius: 2,
                                    boxShadow: theme.shadows[1],
                                }}
                            >
                                <CellIcon color="primary" sx={{ mb: 2 }} />
                                <Typography component="h2" variant="h6" sx={{ mb: 1 }}>
                                    Células
                                </Typography>
                                <Typography>10</Typography>
                            </Box>
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                            <Box
                                sx={{
                                    p: 3,
                                    backgroundColor: "#1b1b1f",                                    borderRadius: 2,
                                    boxShadow: theme.shadows[1],
                                }}
                            >
                                <NewsIcon color="primary" sx={{ mb: 2 }} />
                                <Typography component="h2" variant="h6" sx={{ mb: 1 }}>
                                    Notícias
                                </Typography>
                                <Typography>10</Typography>
                            </Box>
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                            <Box
                                sx={{
                                    p: 3,
                                    backgroundColor: "#1b1b1f",                                    borderRadius: 2,
                                    boxShadow: theme.shadows[1],
                                }}
                            >
                                <WordIcon color="primary" sx={{ mb: 2 }} />
                                <Typography component="h2" variant="h6" sx={{ mb: 1 }}>
                                    Palavras
                                </Typography>
                                <Typography>10</Typography>
                            </Box>
                        </Grid>
                    </Grid>
                </Container>
            </Layout>
        </>
    );
};