import { Box, Button, Paper, Stack, Typography, TextField } from '@mui/material';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router';
import { setAuth, login } from '../../api/authApi';

function LoginPage() {
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const loginMutation = useMutation({
        mutationFn: login,
        onSuccess: (data) => {
            setAuth(data); //localStorage 저장
            queryClient.invalidateQueries({ queryKey: ["me"] });
            navigate("/posts");
        }
    });

    //이벤트 핸들러
    const handleSubmit = (evt) => {
        evt.preventDefault();

        const fd = new FormData(evt.currentTarget);
        loginMutation.mutate({
            email: String(fd.get("email")).trim(),
            password: String(fd.get("password")).trim()
        })
        /*
        const formData = new FormData(evt.currentTarget);

        loginMutation.mutate({
            email: String(formData.get("email")).trim(),
            password: String(formData.get("password")).trim() 
        });*/
    };

    return (
        <Paper sx={{ p: 3 }}>
            <Typography variant="h5" sx={{ fontWeight: 600, mb: 3 }}>
                로그인
            </Typography>

            <Box component="form" onSubmit={handleSubmit}>
                <Stack spacing={2}>
                    <TextField
                        type="email"
                        label="이메일"
                        name="email"
                        size="small"
                        fullWidth
                        required
                    />

                    <TextField
                        type="password"
                        label="비밀번호"
                        name="password"
                        size="small"
                        fullWidth
                        required
                    />

                    {
                        loginMutation.isError && (
                            <Typography variant="body2" color="error">로그인에 실패했습니다</Typography>
                        )
                    }

                    <Button type="submit" variant="contained" disabled={loginMutation.isPending}>{loginMutation.isPending ? "로그인 중 ..." : "로그인"}

                    </Button>
                </Stack>
            </Box>
        </Paper>
    );
}

export default LoginPage;
