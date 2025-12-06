import supabase from '../config/supabase.js';
import bd from '../models/index.js';

const { User } = bd;

class ProfileController {
  async updateAvatar(req, res) {
    try {
      // O arquivo vem no req.file graças ao Multer
      const file = req.file;
      
      if (!file) {
        return res.status(400).json({ error: 'Nenhum arquivo enviado.' });
      }

      // 1. Definir nome único para o arquivo
      // Ex: 1-1707070707-minhafoto.png
      const fileName = `${req.userId}-${Date.now()}-${file.originalname.replace(/\s/g, '')}`;

      // 2. Upload para o Supabase (Bucket 'avatars')
      const { data, error } = await supabase.storage
        .from('avatars')
        .upload(fileName, file.buffer, {
          contentType: file.mimetype,
          upsert: true
        });

      if (error) {
        console.error('Erro Supabase:', error);
        throw error;
      }

      // 3. Obter URL Pública
      const { data: publicData } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName);

      const avatarUrl = publicData.publicUrl;

      // 4. Atualizar no Banco de Dados
      await User.update(
        { avatar_url: avatarUrl },
        { where: { id: req.userId } }
      );

      return res.json({ 
        message: 'Avatar atualizado com sucesso!',
        avatar_url: avatarUrl 
      });

    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Erro ao fazer upload da imagem' });
    }
  }
}

export default new ProfileController();