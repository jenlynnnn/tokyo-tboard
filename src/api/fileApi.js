import { data } from "react-router";
import { api } from "./api";

/*
이미지 업로드 api
사용자 이미지 입력: <input type= "file"/>
*/

export async function uploadImage(file) {
    const formData = new FormData();
    formData.append('file', file);

    const res = await api.post('/api/files/image', formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });

    return res.data;
}
