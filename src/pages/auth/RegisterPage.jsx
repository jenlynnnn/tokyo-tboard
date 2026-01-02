import { Typography, Container, TextField, Box, Stack, Button, } from '@mui/material';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from "react-router";
import { useState } from 'react';
import { register } from '../../api/authApi';


function RegisterPage() {
    const navigate = useNavigate();
    const [form, setForm] = useState({
        email: "",
        nickname: "",
        password: "",
        rePassword: ""
    });

    // 회원가입 + 바로 로그인
    const registerMutation = useMutation({
        mutationFn: register,
        onSuccess: (data) => {
            console.log("회원가입 성공", data);
            navigate("/posts");
        },
        onError: (err) => {
            console.error("회원가입 실패", err);
        }
    });

    //이벤트 핸들러
    const handleChange = (evt) => {
        const { name, value } = evt.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (evt) => {
        evt.preventDefault();

        if (form.password !== form.rePassword) {
            alert("비밀번호와 비밀번호 확인이 일치하지 않습니다");
            return;
        }

        registerMutation.mutate({
            email: form.email.trim(),
            password: form.password.trim(),
            nickname: form.nickname.trim()
        });
    };



    /*
     
        mutationFn: async ({ email, password, nickname }) => {
            await register({ email, password, nickname }); // 회원가입
            const { accessToken } = await login({ email, password }); // 바로 로그인
            setAuth({ accessToken }); // 토큰 저장
        },
     
        onSuccess: () => navigate("/posts"), // 성공 시 리다이렉트
        onError: (err) => alert("회원가입 실패: " + err.message)
    });
     
    const handleChange = (evt) => {
        const { name, value } = evt.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };
     
    const handleSubmit = (evt) => {
        evt.preventDefault();
     
        if (form.password !== form.rePassword) {
            alert("비밀번호와 비밀번호 확인이 일치하지 않습니다");
            return;
        }
     
        // mutate 호출
        registerMutation.mutate({
            email: form.email.trim(),
            password: form.password.trim(),
            nickname: form.nickname.trim()
        });
     
    }; */

    return (
        <Container maxWidth="sm">

            <Typography variant="h5" sx={{ fontWeight: 600, fontSize: 24, mb: 5 }}>회원가입</Typography>

            <Box component="form" onSubmit={handleSubmit}>
                <Stack spacing={2}>
                    <TextField type="email" label="이메일" name="email" size="small" fullWidth placeholder="test@test.com" required value={form.email} onChange={handleChange} />
                    <TextField type="nickname" label="별명" name="nickname" size="small" fullWidth placeholder="별명" required value={form.nickname} onChange={handleChange} />
                    <TextField type="password" label="비밀번호" name="password" size="small" fullWidth required value={form.password} onChange={handleChange} />
                    <TextField type="password" label="비밀번호 확인" name="rePassword" size="small" fullWidth required value={form.rePassword} onChange={handleChange} />

                    {
                        registerMutation.isError && (
                            <Typography variant="body2" color="error">회원가입에 실패했습니다</Typography>
                        )
                    }

                    <Button type="submit" variant="contained" sx={{ mt: 1, borderRadius: 2, textTransform: "none", "&:hover": { background: "#999" } }} disabled={registerMutation.isPending}> {registerMutation.isPending ? "회원가입 중 ..." : "회원가입"} </Button>
                </Stack>
            </Box>

        </Container>
    );
}

export default RegisterPage;

/*
 <form onSubmit={handleSubmit}>
                <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="이메일 입력" /><br />
                <input type="text" name="nickname" value={form.nickname} onChange={handleChange} placeholder="별명 입력" /><br />
                <input type="password" name="password" value={form.password} onChange={handleChange} placeholder="비밀번호 입력" /><br />
                <input type="password" name="rePassword" value={form.rePassword} onChange={handleChange} placeholder="비밀번호 검증" /><br />
                <button type="submit">회원가입</button>
            </form>
*/