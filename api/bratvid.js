const express = require('express');
const axios = require('axios');
const router = express.Router();

router.get('/', async (req, res) => {
    const text = req.query.text;
    if (!text) {
        return res.status(400).json({ 
            status: 400, 
            message: 'Masukkan parameter text.' 
        });
    }

    // Default: background putih (#FFFFFF), teks hitam (#000000)
    const background = encodeURIComponent(req.query.background || '#FFFFFF');
    const color = encodeURIComponent(req.query.color || '#000000');

    try {
        // Request ke API PurrBits
        const apiUrl = `https://purrbits-fastapi.hf.space/api/v1/bratvid?text=${encodeURIComponent(text)}&background=${background}&color=${color}`;
        const response = await axios.get(apiUrl);

        if (!response.data || !response.data.video_url) {
            return res.status(500).json({
                status: 500,
                message: 'Gagal mengambil URL video dari API.'
            });
        }

        // Ambil langsung video MP4
        const video = await axios.get(response.data.video_url, { responseType: 'arraybuffer' });

        res.set('Content-Type', 'video/mp4');
        res.send(video.data);
    } catch (err) {
        res.status(500).json({
            status: 500,
            message: 'Terjadi kesalahan saat mengambil video.',
            error: err.message
        });
    }
});

module.exports = router;