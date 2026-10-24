import authStorage from './auth';

export const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL;

//Função para tratamento da requisição e resposta
async function request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : '/' + endpoint}`;
    const token = authStorage.getToken();

    const headers = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...(options.headers || {})
    };

    if (token) {
        headers['Authorization'] = `Token ${token}`;
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 12000);

    try {
        const response = await fetch(url, {
            ...options,
            headers,
            signal: controller.signal
        });

        clearTimeout(timeoutId);

        // Se a resposta for 204 No Content (ex: DELETE com sucesso)
        if (response.status === 204) {
            return null;
        }

        const data = await response.json().catch(() => null);

        if (!response.ok) {
            const erroMensagem = (data && (data.erro || data.detail || data.Erro)) 
                || (typeof data === 'object' && data !== null ? Object.values(data).flat().join(', ') : null)
                || `Erro na requisição (${response.status})`;
            const error = new Error(erroMensagem);
            error.status = response.status;
            error.data = data;
            throw error;
        }

        return data;
    } catch (err) {
        clearTimeout(timeoutId);
        if (err.name === 'AbortError') {
            throw new Error('Tempo de conexão esgotado.');
        }
        throw err;
    }
}

export const api = {
    get(endpoint, options) {
        return request(endpoint, { ...options, method: 'GET' });
    },
    post(endpoint, body, options) {
        return request(endpoint, {
            ...options,
            method: 'POST',
            body: JSON.stringify(body)
        });
    },
    put(endpoint, body, options) {
        return request(endpoint, {
            ...options,
            method: 'PUT',
            body: JSON.stringify(body)
        });
    },
    patch(endpoint, body, options) {
        return request(endpoint, {
            ...options,
            method: 'PATCH',
            body: JSON.stringify(body)
        });
    },
    delete(endpoint, options) {
        return request(endpoint, { ...options, method: 'DELETE' });
    }
};

export default api;
