import { SetMetadata } from '@nestjs/common';

export const OMITIR_VALIDACION_USUARIO = 'omitirValidacionUsuario';

export const OmitirValidacionUsuario = () =>
	SetMetadata(OMITIR_VALIDACION_USUARIO, true);
