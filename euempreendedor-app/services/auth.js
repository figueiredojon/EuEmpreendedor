
let currentToken = null;
let currentUser = null;

//Função para garantir o armazenamento da sessão durante o uso do app
export const authStorage = {
    setSession(token, user) {
        currentToken = token;
        currentUser = user;
    },
    clearSession() {
        currentToken = null;
        currentUser = null;
    },
    getToken() {
        return currentToken;
    },
    getUser() {
        return currentUser;
    },
    isAuthenticated() {
        return !!currentToken;
    }
};

export default authStorage;
