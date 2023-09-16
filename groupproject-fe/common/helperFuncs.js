// Functions to navigate to different pages
const navigatePage = (type, id = -1, page) => {
    // trim to remove spaces, convert to lowercase to make it case-insensitive
    type = type.trim().toLowerCase();
    switch (type) {
        case 'my-account':
            return '/my-account';
        case 'product':
            return `/product/${id}`;
        case 'product-list':
            return `/viewAll?page=${page}`;
        case 'cart':
            return '/cart';
        case 'new-product':
            return '/new-product';
        case 'update-product':
            return '/update-product';
        case 'vendor-dashboard':
            return '/vendor-dashboard';
        case 'shipper-dashboard':
            return '/shipper-dashboard';
        case 'login':
            return '/login';
        case 'signup-customer':
            return '/signup-customer';
        case 'signup-vendor':
            return '/signup-vendor';
        case 'signup-shipper':
            return '/signup-shipper';
        case 'about':
            return '/about';
        case 'copyright':
            return '/copyright';
        case 'privacy':
            return '/privacy';
        case 'terms':
            return '/terms';
        default:
            return '/';
    }

}

module.exports = {
    navigatePage,
};