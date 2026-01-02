import { Box, Button, Stack, Typography } from '@mui/material';
import React from 'react';

function PostFormImage({ imageName, onChangeImage, uploading }) {
    return (
        <Box>
            <Stack direction='row' alignItems='center' spacing={2} mb={1}>
                <Button variant="outlined" component="label" disabled={uploading} >
                    이미지 선택
                    <input type="file" hidden accept="image/*" onChange={onChangeImage} />
                    {/*<input type="file" hidden accept="image/*" onChange={(evt) =>
                         onChangeImage(evt.target.files[0], evt)} />*/}  {/*".png, , .jpg" -> 이렇게 작성하면 저것만 출력되게됨*/}
                </Button>

                {!uploading && imageName && (
                    <Typography variant="body2" color="#ff8800ff">
                        {imageName}
                    </Typography>
                )}
            </Stack>
        </Box>
    );
}

export default PostFormImage;