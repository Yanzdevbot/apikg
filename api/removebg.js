const fs = require('fs');
const axios = require('axios');
const FormData = require('form-data');

const handler = async (m, { KyyNoroshi, command }) => {
  try {
    const quoted = m.quoted || m;
    const mime = (quoted.msg || quoted).mimetype || '';
    
    if (!mime || !/image/.test(mime)) {
      return m.reply(`❌ Kirim atau reply gambar dengan caption *.removebg*`);
    }

    await m.reply(' Sedang memproses...');

    const mediaPath = await KyyNoroshi.downloadAndSaveMediaMessage(quoted);

    const form = new FormData();
    form.append('file', fs.createReadStream(mediaPath));

    const cloudRes = await axios.post('https://cloudgood.xyz/upload.php', form, {
      headers: form.getHeaders(),
      maxContentLength: Infinity,
      maxBodyLength: Infinity
    });

    fs.unlinkSync(mediaPath);

    const imageUrl = cloudRes.data?.url;
    if (!imageUrl) return m.reply('❌ Gagal upload gambar ke CloudGood.');

    await KyyNoroshi.sendMessage(m.chat, {
      image: { url: `https://kyy-restapiz.vercel.app/tools/removebg?url=${encodeURIComponent(imageUrl)}` },
      caption: '✅ Nih Bang'
    }, { quoted: m });
  } catch (err) {
    console.error('[removebg ERROR]', err);
    m.reply(`❌ Terjadi kesalahan:\n${err.message || 'Unknown error'}`);
  }
};

handler.help = ['removebg'];
handler.tags = ['tools'];
handler.command = ['removebg'];

module.exports = handler;
