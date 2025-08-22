export const GetProdDevRouteBuilder = (path: string) => {
    if (process.env.NODE_ENV === 'production') {
        return (process.env.SUB_DOMAIN_PATH || '') + path;
    } else {
        return path;
    }
};

export const GetProdDevImgRouteBuilder = (path: string) => {
    const BASE_PATH = '/BERGERONE';
    if (process.env.NODE_ENV === 'production') {
        // In production, use the base path if SUB_DOMAIN_IMAGE_PATH is not defined
        return (process.env.SUB_DOMAIN_IMAGE_PATH || '') + BASE_PATH + path;
    } else {
        return BASE_PATH + path;
    }
};
