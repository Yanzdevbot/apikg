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

    // Ambil warna dari query, default: background putih (#FFFFFF), teks hitam (#000000)
    const background = encodeURIComponent(req.query.background || '#FFFFFF');
    const color = encodeURIComponent(req.query.color || '#000000');

    try {
        // Request ke API PurrBits
        const apiUrl = `https://purrbits-fastapi.hf.space/api/v1/brat?text=${encodeURIComponent(text)}&background=${background}&color=${color}`;
        const response = await axios.get(apiUrl);

        if (!response.data || !response.data.image_url) {
            return res.status(500).json({
                status: 500,
                message: 'Gagal mengambil URL gambar dari API.'
            });
        }

        // Ambil langsung gambar PNG
        const img = await axios.get(response.data.image_url, { responseType: 'arraybuffer' });

        res.set('Content-Type', 'image/png');
        res.send(img.data);
    } catch (err) {
        res.status(500).json({
            status: 500,
            message: 'Terjadi kesalahan saat mengambil gambar.',
            error: err.message
        });
    }
});

module.exports = router;