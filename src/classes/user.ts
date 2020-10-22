import { ModelUser } from "../models/user";

export class User {
  private lista: ModelUser[] = [];

  constructor() {}

  public agregar = (usuario: ModelUser) => {
    const query = `
        INSERT INTO test_user (user_name, user_surname, user_email, 
            user_password) values ('${usuario.name}', '${usuario.last_name}', 
            '${usuario.email}', '${usuario.password}' ) `;

    return query;
  };

  public actualizarNombre(id: number, nombre: string) {
    // en esta parte se aria la consulta a la base de datos
    // para ver si existe el usuario
    for (let usuario of this.lista) {
      if (usuario.id_user === id) {
        usuario.name = nombre;
        break;
      }
    }

    console.log("============= Actualizando usuario ============");
    console.log(this.lista);
  }

  // Obtener lista de usuarios y usuario dependiendo el caso
  public getLista = (user?: number) => {
    const query = `
        SELECT user_id, user_name, user_surname,user_role,user_estado,
        user_avatar, user_email, user_createdAt, user_updatedAt, 
        user_deletedAt FROM test_user`;

    if (user) return query + ` where user_id=${user}`;

    return query;
  };

  // Obtener usuario en una sala en particular
  public getUsuarioEnSala(sala: string) {
    // return this.lista.filter ( usuario => usuario.sala === sala );
  }

  // Borrar un usuario
  public borrarUsuario(id: string) {
    // const tempUsuario = this.getUsuario( id );
    // this.lista = this.lista.filter( usuario => usuario.id !== id );
    // return tempUsuario;
  }
}
