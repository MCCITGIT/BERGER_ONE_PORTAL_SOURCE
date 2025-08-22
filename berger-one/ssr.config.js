// SSR Configuration for Berger One Portal
export const ssrConfig = {
    // Development settings
    development: {
        port: 5173,
        base: '/BERGERONE/',
        hotReload: true,
        ssrEnabled: true,
        compression: false,
        caching: false
    },

    // Production settings
    production: {
        port: process.env.PORT || 3000,
        base: process.env.BASE || '/BERGERONE/',
        hotReload: false,
        ssrEnabled: true,
        compression: true,
        caching: false, // Disabled caching
        maxAge: 0 // No cache age
    }
};

// Get current environment
export const getCurrentConfig = () => {
    const env = process.env.NODE_ENV || 'development';
    return ssrConfig[env] || ssrConfig.development;
};

// Export configuration
export default ssrConfig;