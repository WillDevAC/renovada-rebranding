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
import {Button} from "../../components/Button";
import { Modal } from "../../components/Modal";

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

    const [isModalOpen, setIsModalOpen] = useState(false);

    const [reports, setReports] = useState([]);
    const [selectedReportData, setSelectedReport] = useState(null);

    useEffect(() => {
        const fetchReports = async () => {
            try {
                const reportsResponse = await api.get("/group/list-report");
                setReports(reportsResponse.data.data);  // Assuming reports are an array
            } catch (error) {
                console.error("Error fetching reports:", error);
            }
        };

        fetchReports();
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

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

    const getAttendeePercentage = () => {
        if (selectedReportData) {
            const participantCount = selectedReportData.amount;
            const presenceCount = selectedReportData.qtdPresence;
            return (presenceCount / participantCount) * 100;
        }
        return 0;
    };

    const barChartData = {
        labels: ["Participantes", "Presentes"],
        datasets: [
            {
                label: "Porcentagem de Presentes",
                backgroundColor: ["rgba(75,192,192,0.4)", "rgba(255,99,132,0.4)"],
                borderColor: ["rgba(75,192,192,1)", "rgba(255,99,132,1)"],
                borderWidth: 1,
                hoverBackgroundColor: ["rgba(75,192,192,0.6)", "rgba(255,99,132,0.6)"],
                hoverBorderColor: ["rgba(75,192,192,1)", "rgba(255,99,132,1)"],
                data: [100, getAttendeePercentage()],
            },
        ],
    };

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
                    <Typography
                        component="h2"
                        variant="h4"
                        sx={{ mt: 4, mb: 2, fontWeight: "bold" }}
                    >
                        Métricas
                    </Typography>
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
                    <Typography
                        component="h2"
                        variant="h4"
                        sx={{ mt: 4, mb: 2, fontWeight: "bold" }}
                    >
                        Relatórios
                    </Typography>
                    <Grid container spacing={3}>
                        {reports.map((report) => (
                            <Grid item key={report.id} xs={12} sm={6} md={3}>
                                <Box
                                    sx={{
                                        p: 3,
                                        backgroundColor: "#1b1b1f",
                                        borderRadius: 2,
                                        boxShadow: theme.shadows[1],
                                    }}
                                >
                                    {/* Update the following lines based on your report structure */}
                                    <WordIcon color="primary" sx={{ mb: 2 }} />
                                    <Typography component="h2" variant="h6" sx={{ mb: 1 }}>
                                        {report.group.name}
                                    </Typography>
                                    <Typography>{report.dateLabel}</Typography>
                                    <Button
                                        variant="view"
                                        onClick={() => {
                                            setSelectedReport(report);  // Pass the report data to modal
                                            setIsModalOpen(true);
                                        }}
                                    >
                                        Visualizar
                                    </Button>
                                </Box>
                            </Grid>
                        ))}
                    </Grid>
                    <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                        {selectedReportData && (
                            <>
                                <Typography variant="h5">Relatório De {selectedReportData.group.name}</Typography>
                                <Typography>{selectedReportData.dateLabel}</Typography>
                                <Typography>{selectedReportData.address}</Typography>
                                <Typography>Observações: {selectedReportData.obs}</Typography>
                                <Typography>Quantidade de Participantes: {selectedReportData.amount}</Typography>
                                <Typography>Quantidade de Convertidos: {selectedReportData.qtdAcceptedJesus}</Typography>
                                <Typography>Quantidade de Visitantes: {selectedReportData.qtdVisitor}</Typography>
                                <Typography>Quantidade Total de Presentes: {selectedReportData.qtdPresence}</Typography>
                                <Typography>Quantidade de Homens Presentes: {selectedReportData.qtdMalePresence}</Typography>
                                <Typography>Quantidade de Mulheres Presentes: {selectedReportData.qtdFemalePresence}</Typography>
                            </>

                            )}
                    </Modal>
                </Container>
            </Layout>
        </>
    );
};