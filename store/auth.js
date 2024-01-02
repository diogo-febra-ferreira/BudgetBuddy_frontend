import { defineStore } from 'pinia'
import { useRuntimeConfig } from '#app'

export const useAuthStore = defineStore('authStore', () => {
    const runtimeConfig = useRuntimeConfig()
    let accessToken = {}
    accessToken.value = ''
    let currentToken = ''
    let currentUser = null
    validateTokenOnStart()
    async function validateTokenOnStart() {
        try {
            //1 day expiry date
            accessToken = useCookie('accessToken', { maxAge: 86400 })
            currentToken = accessToken.value
            const response = await $fetch(runtimeConfig.public.BACKEND_API_BASE_PATH + '/auth/validate', {
                method: 'GET',
                headers: {
                    'access-token': accessToken.value
                }
            })
            if (!response.Validation) {
                accessToken.value = ''
            } else {
                setAuthenticatedUser(response.User)
            }
        } catch (error) {
            //TODO; show error to user or smthn, Handle login error?
            //maybe not, it's the first time they open the page, they ofc don't have a cookie
            removeToken()
            console.error('Cookie authentication failed:', error)
        }
    }

    function setToken(newToken) {
        accessToken.value = newToken
    }

    function removeToken() {
        accessToken.value = ''
        currentUser = null
    }

    function isAuthenticated() {
        return accessToken.value != ''
    }

    function setAuthenticatedUser(userData) {
        currentUser = userData
    }

    function getAuthenticatedUser() {
        return currentUser
    }

    return { setToken, removeToken, isAuthenticated, setAuthenticatedUser, getAuthenticatedUser }
})
