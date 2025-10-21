import { Injectable } from '@angular/core';
import { getAuth, GoogleAuthProvider, signInWithPopup, signInWithRedirect, getRedirectResult } from 'firebase/auth';

export interface UserRecord {
  username: string;
  email?: string;
  password: string;
}

@Injectable({
  providedIn: 'root'
})
export class Auth {
  private _authenticated = false;
  private STORAGE_KEY = 'mock_users';

  constructor() {
    // Al iniciar el servicio intentamos resolver un posible resultado de redirect
    // (si el usuario regresó desde un signInWithRedirect).
    this._handleRedirectResult();
  }

  private async _handleRedirectResult() {
    try {
      const auth = getAuth();
      const result = await getRedirectResult(auth);
      if (result && result.user) {
        const user = result.user;
        const email = user.email ?? '';
        const username = email ? email.split('@')[0] : (user.displayName ? user.displayName.replace(/\s+/g, '_').toLowerCase() : `redirect_${user.uid}`);

        const users = this._loadUsers();
        const found = email ? users.find(u => u.email === email) : undefined;

        if (!found) {
          const password = Math.random().toString(36).slice(-8);
          const newUser: UserRecord = { username, email: email || undefined, password };
          users.push(newUser);
          localStorage.setItem(this.STORAGE_KEY, JSON.stringify(users));
        }

        // Marcar como autenticado localmente
        this._authenticated = true;
      }
    } catch (err) {
      // No es crítico — puede suceder si no hubo redirect pendiente
      // Mantener silencio o log para depuración.
      console.debug('No redirect result or error resolving redirect result', err);
    }
  }

  /**
   * Simula un login. Reemplazar con petición HTTP real si es necesario.
   */
  login(username: string, password: string): Promise<boolean> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const users = this._loadUsers();
        const found = users.find(u => u.username === username && u.password === password);
        if (found) {
          this._authenticated = true;
          resolve(true);
        } else {
          resolve(false);
        }
      }, 300);
    });
  }

  /**
   * Registra un usuario en un storage simulado (localStorage).
   * Reemplazar con petición HTTP real si es necesario.
   */
  register(username: string, password: string, email?: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const users = this._loadUsers();
        const exists = users.some(u => u.username === username || (email && u.email === email));
        if (exists) {
          resolve(false); // usuario ya existe
          return;
        }

        const newUser: UserRecord = { username, password, email };
        users.push(newUser);
        try {
          localStorage.setItem(this.STORAGE_KEY, JSON.stringify(users));
          resolve(true);
        } catch (err) {
          reject(err);
        }
      }, 400);
    });
  }

  /**
   * Lista de usuarios (simulado).
   */
  listUsers(): Promise<UserRecord[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(this._loadUsers());
      }, 150);
    });
  }

  /**
   * Actualiza un usuario por username. Devuelve true si se actualizó.
   */
  updateUser(username: string, data: Partial<UserRecord>): Promise<boolean> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        try {
          const users = this._loadUsers();
          const idx = users.findIndex(u => u.username === username);
          if (idx === -1) {
            resolve(false);
            return;
          }
          const updated = { ...users[idx], ...data };
          users[idx] = updated;
          localStorage.setItem(this.STORAGE_KEY, JSON.stringify(users));
          resolve(true);
        } catch (err) {
          reject(err);
        }
      }, 250);
    });
  }

  /**
   * Resetea la contraseña de un usuario identificado por username o email.
   * Devuelve la contraseña temporal (string) si se encontró y actualizó, o false si no existe.
   */
  resetPassword(identifier: string): Promise<string | false> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        try {
          const users = this._loadUsers();
          const id = (identifier || '').trim().toLowerCase();
          console.debug('resetPassword called for identifier', { raw: identifier, normalized: id, usersCount: users.length });

          const idx = users.findIndex(u => {
            const uname = (u.username || '').trim().toLowerCase();
            const uemail = (u.email || '').trim().toLowerCase();
            return uname === id || (uemail && uemail === id);
          });

          if (idx === -1) {
            console.debug('resetPassword: user not found', { identifier: id });
            resolve(false);
            return;
          }

          const tempPass = Math.random().toString(36).slice(-8);
          users[idx].password = tempPass;
          localStorage.setItem(this.STORAGE_KEY, JSON.stringify(users));
          console.debug('resetPassword: password updated for user', { username: users[idx].username, email: users[idx].email });
          resolve(tempPass);
        } catch (err) {
          reject(err);
        }
      }, 250);
    });
  }

  /**
   * Elimina un usuario por username. Devuelve true si se eliminó.
   */
  deleteUser(username: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        try {
          const users = this._loadUsers();
          const filtered = users.filter(u => u.username !== username);
          if (filtered.length === users.length) {
            resolve(false); // no encontrado
            return;
          }
          localStorage.setItem(this.STORAGE_KEY, JSON.stringify(filtered));
          resolve(true);
        } catch (err) {
          reject(err);
        }
      }, 250);
    });
  }

  /**
   * Inicia sesión con Google (Firebase). Intentamos popup primero; si falla
   * (p. ej. popup bloqueado o no soportado) hacemos redirect como fallback.
   * Si se usa redirect, la función puede no retornar porque redirigirá la página.
   */
  async signInWithGoogle(): Promise<boolean> {
    const auth = getAuth();
    const provider = new GoogleAuthProvider();

    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      const email = user.email ?? '';
      const username = email ? email.split('@')[0] : `google_${user.uid}`;

      const users = this._loadUsers();
      const found = users.find(u => u.email === email);

      if (!found) {
        const password = Math.random().toString(36).slice(-8);
        const newUser: UserRecord = { username, email, password };
        users.push(newUser);
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(users));
      }

      this._authenticated = true;
      return true;
    } catch (err: any) {
      console.warn('Popup failed for Google login, falling back to redirect', err?.code || err);
      try {
        // Inicia el redirect; no habrá resultado aquí porque la app será redirigida.
        await signInWithRedirect(auth, provider);
        // devolver false ya que el flujo continuará tras redirect
        return false;
      } catch (redirectErr) {
        console.error('Google redirect fallback failed', redirectErr);
        return false;
      }
    }
  }


  /**
   * Cierra la sesión localmente.
   */
  logout(): void {
    this._authenticated = false;
    // Aquí podrías limpiar tokens en storage, etc.
  }

  /**
   * Indica si el usuario está autenticado (estado local).
   */
  isAuthenticated(): boolean {
    return this._authenticated;
  }

  private _loadUsers(): UserRecord[] {
    try {
      const raw = localStorage.getItem(this.STORAGE_KEY);
      return raw ? JSON.parse(raw) as UserRecord[] : [];
    } catch (err) {
      return [];
    }
  }
}
