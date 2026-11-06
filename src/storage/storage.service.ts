import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Injectable()
export class StorageService {
  private supabase: SupabaseClient;

  constructor(private configService: ConfigService) {
    this.supabase = createClient(
      this.configService.get<string>('SUPABASE_URL')!,
      this.configService.get<string>('SUPABASE_KEY')!
    );
  }

  async subirImagen(file: Express.Multer.File): Promise<string> {
    const nombreArchivo = `${Date.now()}-${file.originalname.replace(/\s+/g, '_')}`;

    const { data, error } = await this.supabase.storage
      .from('imagenes')
      .upload(nombreArchivo, file.buffer, {
        contentType: file.mimetype,
      });

    if (error) {
      console.error(error);
      throw new InternalServerErrorException('Error al subir la imagen a Supabase');
    }

    const { data: { publicUrl } } = this.supabase.storage
      .from('imagenes')
      .getPublicUrl(nombreArchivo);

    return publicUrl;
  }
}