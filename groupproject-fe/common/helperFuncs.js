// RMIT University Vietnam
// Course: COSC2430 Web Programming
// Semester: 2023B
// Assessment: Assignment 2
// Authors: Tran Mai Nhung - s3879954
//          Tran Nguyen Ha Khanh - s3877707
//          Nguyen Vinh Gia Bao - s3986287
//          Ton That Huu Luan - s3958304
//          Ho Van Khoa - s3997024
// Acknowledgement: 

// Functions to navigate to different pages
const navigatePage = (type, id = -1, pageInfo) => {
    // trim to remove spaces, convert to lowercase to make it case-insensitive
    type = type.trim().toLowerCase();
    switch (type) {
        case 'my-account':
            return '/my-account';
        case 'product':
            return `/product/${id}`;
        case 'product-list':
            if (pageInfo) return `/viewAll?page=${pageInfo?.page}&minp=${pageInfo?.minPrice}&maxp=${pageInfo?.maxPrice}&name=${pageInfo?.search}`;
            return `/viewAll`;
        case 'product-update':
            return `/update-product/${id}`;
        case 'product-add':
            return '/new-product';
        case 'product-delete':
            return `/delete-product/${id}`;
        case 'vendor-product-list':
            return `/vendor-dashboard?page=${pageInfo?.page}`;
        case 'cart':
            return '/cart';
        case 'cart-update':
            return `/cart-update`;
        case 'cart-delete':
            return `/cart-delete`;
        case 'checkout':
            return '/order';
        case 'place-order':
            return '/order';
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

const formatCurrency = (number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(number);
};
module.exports = {
    navigatePage,
    formatCurrency
};