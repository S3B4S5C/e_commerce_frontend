export const getProductImage = (category: string): string => {
    switch (category) {
      case 'Teclado':
        return 'https://www.daskeyboard.com/images/mactigr/MacTigr-thumb-top.jpeg';
      case 'Smartphones':
        return 'https://m.media-amazon.com/images/I/51AHHmX-17L.jpg';
      case 'Tablets':
        return 'https://i.blogs.es/6dbb45/captura-de-pantalla-2024-12-11-a-las-8.41.12/650_1200.png';
      case 'Cámara':
        return 'https://www.abc.cl/dw/image/v2/BCPP_PRD/on/demandware.static/-/Sites-master-catalog/default/dw13ddbb4d/images/large/26747376.jpg';
      case 'Mouse':
        return 'https://sofmat.com.bo/wp-content/uploads/2021/05/Mouse-Logitech-M90.jpg';
      case 'Laptops':
        return 'https://intecsa.com.bo/wp-content/uploads/2024/07/LATITUDE-3420-2.jpg';
      case 'Electrodoméstico':
        return 'https://www.tiendaamiga.com.bo/media/catalog/product/cache/deb88dadd509903c96aaa309d3e790dc/l/a/lavadora_secadora_de_12_kg_-7_kg_con_inteligencia_artificial_1.jpg';
      case 'Parlante':
        return 'https://master-g.com.bo/wp-content/uploads/2023/02/beatbox.jpg';
      case 'Smart Watches':
        return 'https://sologamerbolivia.com/cdn/shop/products/Reloj-inteligente-GS-Ultra-8-para-hombre-y-mujer-accesorio-de-pulsera-deportivo-con-Monitor-de.jpg_640x640_44b061c1-8a09-4d58-a067-51b0ad043616.jpg';
      case 'Consola':
        return 'https://i5.walmartimages.com/seo/Microsoft-Xbox-Series-S-1TB-Black_407abe16-746c-41d1-a59c-a6ea35a44920.850984947740bb726782ccfe53ebcff4.jpeg';
      case 'Headphones':
        return 'https://acdn-us.mitiendanube.com/stores/884/018/products/gamma-hogar-2022-10-25t104326-7711-f545577cf5cc3a201b16667059054363-1024-1024.jpg';
      case 'Television':
        return 'https://images.philips.com/is/image/philipsconsumer/82297dea811e471aa356b16f00253629?$pnglarge$&wid=1250';
      case 'Monitor':
        return 'https://sologamerbolivia.com/cdn/shop/files/Monitor-25-ASRock-Challenger-CL25FF-100Hz-1ms-1.jpg';
      case 'Drone':
        return 'https://store.potensic.com/cdn/shop/files/ATOM_SE_drone_fly_more_combo_1.jpg';
      case 'Accesorio':
        return 'https://epyelectronica.com/wp-content/uploads/2020/09/Cargador-de-Alimentacion-Arduino-DC-5v-2A.png';
      default:
        return 'https://media.istockphoto.com/id/1162198273/vector/question-mark-icon-flat-vector-illustration-design.jpg?s=612x612&w=0&k=20&c=MJbd8bw2iewJRd8sEkHxyGMgY3__j9MKA8cXvIvLT9E=';
    }
  }