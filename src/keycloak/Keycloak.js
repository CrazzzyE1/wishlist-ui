import Keycloak from 'keycloak-js';

const keycloak = new Keycloak({
    // url: 'http://192.168.1.141:9090/',
    url: 'https://auth.wishlisty.ru/',
    realm: 'wishlistsocialnetwork',
    clientId: 'wishlist-ui'
});

export default keycloak;