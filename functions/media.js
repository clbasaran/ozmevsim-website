// Media API for Cloudflare Pages Functions

// Mock media files data - in production this would come from a database
// Only include files that actually exist in the uploads directory
let mediaFiles = [
  {
    id: '1',
    name: 'vaillant-ecotec.jpg',
    originalName: 'vaillant-ecotec.jpg',
    type: 'image',
    mimeType: 'image/jpeg',
    size: 245760,
    url: '/uploads/products/vaillant-ecotec.jpg',
    thumbnail: '/uploads/products/vaillant-ecotec.jpg',
    alt: 'Vaillant EcoTec Kombi Modeli',
    caption: 'Yüksek verimli Vaillant EcoTec kombi',
    folder: 'products',
    uploadedAt: '2024-03-15T10:00:00Z',
    uploadedBy: 'Admin',
    dimensions: { width: 800, height: 600 }
  },
  {
    id: '2',
    name: 'ariston-kombi.jpg',
    originalName: 'ariston-kombi.jpg',
    type: 'image',
    mimeType: 'image/jpeg',
    size: 198432,
    url: '/uploads/products/ariston-kombi.jpg',
    thumbnail: '/uploads/products/ariston-kombi.jpg',
    alt: 'Ariston Kombi Modeli',
    caption: 'Ekonomik Ariston kombi serisi',
    folder: 'products',
    uploadedAt: '2024-03-14T15:30:00Z',
    uploadedBy: 'Admin',
    dimensions: { width: 800, height: 600 }
  },
  {
    id: '3',
    name: 'daikin-altherma.jpg',
    originalName: 'daikin-altherma.jpg',
    type: 'image',
    mimeType: 'image/jpeg',
    size: 312576,
    url: '/uploads/products/daikin-altherma.jpg',
    thumbnail: '/uploads/products/daikin-altherma.jpg',
    alt: 'Daikin Altherma Isı Pompası',
    caption: 'Inverter teknolojili Daikin Altherma',
    folder: 'products',
    uploadedAt: '2024-03-13T09:15:00Z',
    uploadedBy: 'Admin',
    dimensions: { width: 800, height: 600 }
  },
  {
    id: '4',
    name: 'mitsubishi-msz.jpg',
    originalName: 'mitsubishi-msz.jpg',
    type: 'image',
    mimeType: 'image/jpeg',
    size: 287104,
    url: '/uploads/products/mitsubishi-msz.jpg',
    thumbnail: '/uploads/products/mitsubishi-msz.jpg',
    alt: 'Mitsubishi MSZ Klima Modeli',
    caption: 'Sessiz çalışan Mitsubishi MSZ klima',
    folder: 'products',
    uploadedAt: '2024-03-12T14:20:00Z',
    uploadedBy: 'Admin',
    dimensions: { width: 800, height: 600 }
  },
  {
    id: '5',
    name: 'baymak-lunatec.jpg',
    originalName: 'baymak-lunatec.jpg',
    type: 'image',
    mimeType: 'image/jpeg',
    size: 234880,
    url: '/uploads/products/baymak-lunatec.jpg',
    thumbnail: '/uploads/products/baymak-lunatec.jpg',
    alt: 'Baymak Lunatec Kombi Modeli',
    caption: 'Yerli üretim Baymak Lunatec kombi',
    folder: 'products',
    uploadedAt: '2024-03-11T11:45:00Z',
    uploadedBy: 'Admin',
    dimensions: { width: 800, height: 600 }
  },
  {
    id: '6',
    name: 'purmo-radiator.jpg',
    originalName: 'purmo-radiator.jpg',
    type: 'image',
    mimeType: 'image/jpeg',
    size: 156672,
    url: '/uploads/products/purmo-radiator.jpg',
    thumbnail: '/uploads/products/purmo-radiator.jpg',
    alt: 'Purmo Panel Radyatör',
    caption: 'Panel radyatör Purmo serisi',
    folder: 'products',
    uploadedAt: '2024-03-10T16:30:00Z',
    uploadedBy: 'Admin',
    dimensions: { width: 800, height: 600 }
  },
  {
    id: '7',
    name: 'buderus-gb122i2.jpg',
    originalName: 'buderus-gb122i2.jpg',
    type: 'image',
    mimeType: 'image/jpeg',
    size: 298752,
    url: '/uploads/products/buderus-gb122i2.jpg',
    thumbnail: '/uploads/products/buderus-gb122i2.jpg',
    alt: 'Buderus GB122i2 Kombi Modeli',
    caption: 'Alman teknolojisi Buderus GB122i2 kombi',
    folder: 'products',
    uploadedAt: '2024-03-09T13:15:00Z',
    uploadedBy: 'Admin',
    dimensions: { width: 800, height: 600 }
  },
  {
    id: '8',
    name: 'bosch-kombi.jpg',
    originalName: 'bosch-kombi.jpg',
    type: 'image',
    mimeType: 'image/jpeg',
    size: 189440,
    url: '/uploads/products/bosch-kombi.jpg',
    thumbnail: '/uploads/products/bosch-kombi.jpg',
    alt: 'Bosch Kombi Modeli',
    caption: 'Güvenilir Bosch kombi',
    folder: 'products',
    uploadedAt: '2024-03-08T10:00:00Z',
    uploadedBy: 'Admin',
    dimensions: { width: 800, height: 600 }
  },
  {
    id: '9',
    name: 'baymak-elegant.jpg',
    originalName: 'baymak-elegant.jpg',
    type: 'image',
    mimeType: 'image/jpeg',
    size: 234880,
    url: '/uploads/products/baymak-elegant.jpg',
    thumbnail: '/uploads/products/baymak-elegant.jpg',
    alt: 'Baymak Elegant Kombi',
    caption: 'Şık tasarım Baymak Elegant kombi',
    folder: 'products',
    uploadedAt: '2024-03-07T12:30:00Z',
    uploadedBy: 'Admin',
    dimensions: { width: 800, height: 600 }
  },
  {
    id: '10',
    name: 'baymak-duotec.jpg',
    originalName: 'baymak-duotec.jpg',
    type: 'image',
    mimeType: 'image/jpeg',
    size: 287104,
    url: '/uploads/products/baymak-duotec.jpg',
    thumbnail: '/uploads/products/baymak-duotec.jpg',
    alt: 'Baymak Duotec Kombi',
    caption: 'Çift fonksiyonlu Baymak Duotec kombi',
    folder: 'products',
    uploadedAt: '2024-03-06T09:00:00Z',
    uploadedBy: 'Admin',
    dimensions: { width: 800, height: 600 }
  },
  
  // NEW BRAND LOGOS
  {
    id: '11',
    name: 'bosch-logo.png',
    originalName: 'bosch-logo.png',
    type: 'image',
    mimeType: 'image/png',
    size: 110305,
    url: '/uploads/brands/bosch-logo.png',
    thumbnail: '/uploads/brands/bosch-logo.png',
    alt: 'Bosch Logo',
    caption: 'Bosch marka logosu',
    folder: 'brands',
    uploadedAt: '2024-06-16T10:00:00Z',
    uploadedBy: 'Admin',
    dimensions: { width: 200, height: 100 }
  },
  {
    id: '12',
    name: 'vaillant-logo.png',
    originalName: 'vaillant-logo.png',
    type: 'image',
    mimeType: 'image/png',
    size: 66697,
    url: '/uploads/brands/vaillant-logo.png',
    thumbnail: '/uploads/brands/vaillant-logo.png',
    alt: 'Vaillant Logo',
    caption: 'Vaillant marka logosu',
    folder: 'brands',
    uploadedAt: '2024-06-16T10:00:00Z',
    uploadedBy: 'Admin',
    dimensions: { width: 200, height: 100 }
  },
  {
    id: '13',
    name: 'buderus-logo.png',
    originalName: 'buderus-logo.png',
    type: 'image',
    mimeType: 'image/png',
    size: 117922,
    url: '/uploads/brands/buderus-logo.png',
    thumbnail: '/uploads/brands/buderus-logo.png',
    alt: 'Buderus Logo',
    caption: 'Buderus marka logosu',
    folder: 'brands',
    uploadedAt: '2024-06-16T10:00:00Z',
    uploadedBy: 'Admin',
    dimensions: { width: 200, height: 100 }
  },
  {
    id: '14',
    name: 'baymak-logo.png',
    originalName: 'baymak-logo.png',
    type: 'image',
    mimeType: 'image/png',
    size: 25000,
    url: '/uploads/brands/baymak-logo.png',
    thumbnail: '/uploads/brands/baymak-logo.png',
    alt: 'Baymak Logo',
    caption: 'Baymak marka logosu',
    folder: 'brands',
    uploadedAt: '2024-06-16T10:00:00Z',
    uploadedBy: 'Admin',
    dimensions: { width: 200, height: 100 }
  },
  {
    id: '15',
    name: 'demirdokum-logo.png',
    originalName: 'demirdokum-logo.png',
    type: 'image',
    mimeType: 'image/png',
    size: 2091,
    url: '/uploads/brands/demirdokum-logo.png',
    thumbnail: '/uploads/brands/demirdokum-logo.png',
    alt: 'DemirDöküm Logo',
    caption: 'DemirDöküm marka logosu',
    folder: 'brands',
    uploadedAt: '2024-06-16T10:00:00Z',
    uploadedBy: 'Admin',
    dimensions: { width: 200, height: 100 }
  },
  {
    id: '16',
    name: 'eca-logo.png',
    originalName: 'eca-logo.png',
    type: 'image',
    mimeType: 'image/png',
    size: 141045,
    url: '/uploads/brands/eca-logo.png',
    thumbnail: '/uploads/brands/eca-logo.png',
    alt: 'ECA Logo',
    caption: 'ECA marka logosu',
    folder: 'brands',
    uploadedAt: '2024-06-16T10:00:00Z',
    uploadedBy: 'Admin',
    dimensions: { width: 200, height: 100 }
  },
  
  // NEW PRODUCT IMAGES
  {
    id: '17',
    name: 'bosch-condens-8300iw.png',
    originalName: 'bosch-condens-8300iw.png',
    type: 'image',
    mimeType: 'image/png',
    size: 89893,
    url: '/uploads/products/bosch/bosch-condens-8300iw.png',
    thumbnail: '/uploads/products/bosch/bosch-condens-8300iw.png',
    alt: 'Bosch Condens 8300iW Kombi',
    caption: 'Bosch Condens 8300iW yoğuşmalı kombi',
    folder: 'products',
    uploadedAt: '2024-06-16T10:00:00Z',
    uploadedBy: 'Admin',
    dimensions: { width: 480, height: 480 }
  },
  {
    id: '18',
    name: 'bosch-tronic-8500i.png',
    originalName: 'bosch-tronic-8500i.png',
    type: 'image',
    mimeType: 'image/png',
    size: 89893,
    url: '/uploads/products/bosch/bosch-tronic-8500i.png',
    thumbnail: '/uploads/products/bosch/bosch-tronic-8500i.png',
    alt: 'Bosch Tronic 8500i Elektrikli Su Isıtıcısı',
    caption: 'Bosch Tronic 8500i anlık elektrikli su ısıtıcısı',
    folder: 'products',
    uploadedAt: '2024-06-16T10:00:00Z',
    uploadedBy: 'Admin',
    dimensions: { width: 480, height: 480 }
  },
  {
    id: '19',
    name: 'vaillant-ecotec-exclusive.png',
    originalName: 'vaillant-ecotec-exclusive.png',
    type: 'image',
    mimeType: 'image/png',
    size: 173408,
    url: '/uploads/products/vaillant/vaillant-ecotec-exclusive.png',
    thumbnail: '/uploads/products/vaillant/vaillant-ecotec-exclusive.png',
    alt: 'Vaillant ecoTEC Exclusive Kombi',
    caption: 'Vaillant ecoTEC Exclusive premium kombi',
    folder: 'products',
    uploadedAt: '2024-06-16T10:00:00Z',
    uploadedBy: 'Admin',
    dimensions: { width: 1000, height: 800 }
  },
  {
    id: '20',
    name: 'vaillant-ecotec-plus.png',
    originalName: 'vaillant-ecotec-plus.png',
    type: 'image',
    mimeType: 'image/png',
    size: 513838,
    url: '/uploads/products/vaillant/vaillant-ecotec-plus.png',
    thumbnail: '/uploads/products/vaillant/vaillant-ecotec-plus.png',
    alt: 'Vaillant ecoTEC Plus Kombi',
    caption: 'Vaillant ecoTEC Plus yoğuşmalı kombi',
    folder: 'products',
    uploadedAt: '2024-06-16T10:00:00Z',
    uploadedBy: 'Admin',
    dimensions: { width: 1000, height: 800 }
  },
  {
    id: '21',
    name: 'buderus-logatherm-wlw186i.png',
    originalName: 'buderus-logatherm-wlw186i.png',
    type: 'image',
    mimeType: 'image/png',
    size: 135026,
    url: '/uploads/products/buderus/buderus-logatherm-wlw186i.png',
    thumbnail: '/uploads/products/buderus/buderus-logatherm-wlw186i.png',
    alt: 'Buderus Logatherm WLW186i Isı Pompası',
    caption: 'Buderus Logatherm WLW186i AR ısı pompası',
    folder: 'products',
    uploadedAt: '2024-06-16T10:00:00Z',
    uploadedBy: 'Admin',
    dimensions: { width: 420, height: 336 }
  },
  {
    id: '22',
    name: 'buderus-logano-plus.png',
    originalName: 'buderus-logano-plus.png',
    type: 'image',
    mimeType: 'image/png',
    size: 135026,
    url: '/uploads/products/buderus/buderus-logano-plus.png',
    thumbnail: '/uploads/products/buderus/buderus-logano-plus.png',
    alt: 'Buderus Logano Plus Kombi',
    caption: 'Buderus Logano Plus GB125 kombi',
    folder: 'products',
    uploadedAt: '2024-06-16T10:00:00Z',
    uploadedBy: 'Admin',
    dimensions: { width: 420, height: 336 }
  },
  {
    id: '23',
    name: 'baymak-lunatec-kombi.png',
    originalName: 'baymak-lunatec-kombi.png',
    type: 'image',
    mimeType: 'image/png',
    size: 50000,
    url: '/uploads/products/baymak/baymak-lunatec-kombi.png',
    thumbnail: '/uploads/products/baymak/baymak-lunatec-kombi.png',
    alt: 'Baymak Lunatec Kombi',
    caption: 'Baymak Lunatec tam yoğuşmalı kombi',
    folder: 'products',
    uploadedAt: '2024-06-16T10:00:00Z',
    uploadedBy: 'Admin',
    dimensions: { width: 400, height: 400 }
  },
  {
    id: '24',
    name: 'baymak-elegant-plus-klima.png',
    originalName: 'baymak-elegant-plus-klima.png',
    type: 'image',
    mimeType: 'image/png',
    size: 50000,
    url: '/uploads/products/baymak/baymak-elegant-plus-klima.png',
    thumbnail: '/uploads/products/baymak/baymak-elegant-plus-klima.png',
    alt: 'Baymak Elegant Plus Klima',
    caption: 'Baymak Elegant Plus duvar tipi split klima',
    folder: 'products',
    uploadedAt: '2024-06-16T10:00:00Z',
    uploadedBy: 'Admin',
    dimensions: { width: 400, height: 400 }
  },
  {
    id: '25',
    name: 'demirdokum-nitromix-kombi.png',
    originalName: 'demirdokum-nitromix-kombi.png',
    type: 'image',
    mimeType: 'image/png',
    size: 12579,
    url: '/uploads/products/demirdokum/demirdokum-nitromix-kombi.png',
    thumbnail: '/uploads/products/demirdokum/demirdokum-nitromix-kombi.png',
    alt: 'DemirDöküm Nitromix Kombi',
    caption: 'DemirDöküm Nitromix ioni yoğuşmalı kombi',
    folder: 'products',
    uploadedAt: '2024-06-16T10:00:00Z',
    uploadedBy: 'Admin',
    dimensions: { width: 300, height: 400 }
  },
  {
    id: '26',
    name: 'eca-confeo-kombi.png',
    originalName: 'eca-confeo-kombi.png',
    type: 'image',
    mimeType: 'image/png',
    size: 141186,
    url: '/uploads/products/eca/eca-confeo-kombi.png',
    thumbnail: '/uploads/products/eca/eca-confeo-kombi.png',
    alt: 'ECA Confeo Kombi',
    caption: 'ECA Confeo premix yoğuşmalı kombi',
    folder: 'products',
    uploadedAt: '2024-06-16T10:00:00Z',
    uploadedBy: 'Admin',
    dimensions: { width: 400, height: 500 }
  },
  {
    id: '27',
    name: 'eca-mixer-banyo.png',
    originalName: 'eca-mixer-banyo.png',
    type: 'image',
    mimeType: 'image/png',
    size: 141186,
    url: '/uploads/products/eca/eca-mixer-banyo.png',
    thumbnail: '/uploads/products/eca/eca-mixer-banyo.png',
    alt: 'ECA Banyo Bataryası',
    caption: 'ECA banyo lavabo bataryası',
    folder: 'products',
    uploadedAt: '2024-06-16T10:00:00Z',
    uploadedBy: 'Admin',
    dimensions: { width: 400, height: 500 }
  }
];

// Filter function to ensure only valid files are returned
function getValidMediaFiles() {
  // Include all the new files we've added
  const validFileNames = [
    'vaillant-ecotec.jpg', 'ariston-kombi.jpg', 'daikin-altherma.jpg', 
    'mitsubishi-msz.jpg', 'baymak-lunatec.jpg', 'purmo-radiator.jpg',
    'buderus-gb122i2.jpg', 'bosch-kombi.jpg', 'baymak-elegant.jpg', 
    'baymak-duotec.jpg',
    // Brand logos
    'bosch-logo.png', 'vaillant-logo.png', 'buderus-logo.png',
    'baymak-logo.png', 'demirdokum-logo.png', 'eca-logo.png',
    // New product images
    'bosch-condens-8300iw.png', 'bosch-tronic-8500i.png',
    'vaillant-ecotec-exclusive.png', 'vaillant-ecotec-plus.png',
    'buderus-logatherm-wlw186i.png', 'buderus-logano-plus.png',
    'baymak-lunatec-kombi.png', 'baymak-elegant-plus-klima.png',
    'demirdokum-nitromix-kombi.png', 'eca-confeo-kombi.png', 'eca-mixer-banyo.png'
  ];
  
  const validFiles = mediaFiles.filter(file => {
    return validFileNames.includes(file.name);
  });
  
  return validFiles;
}

export async function onRequest(context) {
  const { request } = context;
  const url = new URL(request.url);
  
  // CORS headers
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };

  if (request.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (request.method === 'GET') {
      const type = url.searchParams.get('type');
      const folder = url.searchParams.get('folder');
      const search = url.searchParams.get('search');
      const limit = parseInt(url.searchParams.get('limit')) || 50;
      
      // Get only valid files
      let filteredFiles = getValidMediaFiles();

      // Filter by type
      if (type && type !== 'all') {
        filteredFiles = filteredFiles.filter(file => file.type === type);
      }

      // Filter by folder
      if (folder && folder !== 'all') {
        filteredFiles = filteredFiles.filter(file => file.folder === folder);
      }

      // Filter by search term
      if (search) {
        const searchLower = search.toLowerCase();
        filteredFiles = filteredFiles.filter(file => 
          file.name.toLowerCase().includes(searchLower) ||
          file.originalName.toLowerCase().includes(searchLower) ||
          (file.alt && file.alt.toLowerCase().includes(searchLower)) ||
          (file.caption && file.caption.toLowerCase().includes(searchLower))
        );
      }

      // Apply limit
      filteredFiles = filteredFiles.slice(0, limit);

      // Get statistics
      const allValidFiles = getValidMediaFiles();
      const stats = {
        total: allValidFiles.length,
        images: allValidFiles.filter(f => f.type === 'image').length,
        videos: allValidFiles.filter(f => f.type === 'video').length,
        documents: allValidFiles.filter(f => f.type === 'document').length
      };

      return new Response(JSON.stringify({
        success: true,
        data: filteredFiles,
        stats: stats,
        total: filteredFiles.length
      }), {
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders
        }
      });
    }

    if (request.method === 'POST') {
      const body = await request.json();
      
      if (body.action === 'add') {
        // In demo mode, don't actually add files from uploads
        // This prevents 404 errors from non-existent uploaded files
        return new Response(JSON.stringify({
          success: true,
          message: 'Demo modunda dosyalar eklenmez',
          data: getValidMediaFiles()
        }), {
          headers: {
            'Content-Type': 'application/json',
            ...corsHeaders
          }
        });
      }

      return new Response(JSON.stringify({
        success: false,
        error: 'Invalid action'
      }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders
        }
      });
    }

    if (request.method === 'PUT') {
      const body = await request.json();
      const { id, alt, caption, folder } = body;
      
      const fileIndex = mediaFiles.findIndex(f => f.id === id);
      if (fileIndex === -1) {
        return new Response(JSON.stringify({
          success: false,
          error: 'Dosya bulunamadı'
        }), {
          status: 404,
          headers: {
            'Content-Type': 'application/json',
            ...corsHeaders
          }
        });
      }

      // Update file metadata
      mediaFiles[fileIndex] = {
        ...mediaFiles[fileIndex],
        alt: alt || mediaFiles[fileIndex].alt,
        caption: caption || mediaFiles[fileIndex].caption,
        folder: folder || mediaFiles[fileIndex].folder
      };

      return new Response(JSON.stringify({
        success: true,
        message: 'Dosya bilgileri güncellendi',
        data: mediaFiles[fileIndex]
      }), {
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders
        }
      });
    }

    if (request.method === 'DELETE') {
      const body = await request.json();
      const { ids } = body;
      
      if (!Array.isArray(ids)) {
        return new Response(JSON.stringify({
          success: false,
          error: 'Geçersiz dosya ID listesi'
        }), {
          status: 400,
          headers: {
            'Content-Type': 'application/json',
            ...corsHeaders
          }
        });
      }

      // Remove files (in demo mode, just filter them out)
      const deletedCount = mediaFiles.length;
      mediaFiles = mediaFiles.filter(file => !ids.includes(file.id));
      const actualDeletedCount = deletedCount - mediaFiles.length;

      return new Response(JSON.stringify({
        success: true,
        message: `${actualDeletedCount} dosya silindi`,
        deletedCount: actualDeletedCount
      }), {
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders
        }
      });
    }

    return new Response(JSON.stringify({
      success: false,
      error: 'Method not allowed'
    }), {
      status: 405,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders
      }
    });

  } catch (error) {
    return new Response(JSON.stringify({
      success: false,
      error: 'Internal server error: ' + error.message
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders
      }
    });
  }
} 