// Upload API for Cloudflare Pages Functions
// Demo mode - simulates file uploads without actually saving files

export async function onRequest(context) {
  const { request } = context;
  
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
    if (request.method === 'POST') {
      try {
        const formData = await request.formData();
        const files = formData.getAll('files');
        const folder = formData.get('folder') || 'general';
        
        if (!files || files.length === 0) {
          return new Response(JSON.stringify({
            success: false,
            error: 'Dosya bulunamadı'
          }), {
            status: 400,
            headers: {
              'Content-Type': 'application/json',
              ...corsHeaders
            }
          });
        }

        const maxFileSize = 10 * 1024 * 1024; // 10MB
        const allowedTypes = [
          'image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp',
          'video/mp4', 'video/avi', 'video/mov',
          'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        ];

        // Validate all files first
        for (const file of files) {
          // Validate file size
          if (file.size > maxFileSize) {
            return new Response(JSON.stringify({
              success: false,
              error: `Dosya ${file.name} çok büyük. Maksimum boyut 10MB.`
            }), {
              status: 400,
              headers: {
                'Content-Type': 'application/json',
                ...corsHeaders
              }
            });
          }

          // Validate file type
          if (!allowedTypes.includes(file.type)) {
            return new Response(JSON.stringify({
              success: false,
              error: `Dosya türü ${file.type} desteklenmiyor.`
            }), {
              status: 400,
              headers: {
                'Content-Type': 'application/json',
                ...corsHeaders
              }
            });
          }
        }

        // In demo mode, simulate successful upload without creating file references
        return new Response(JSON.stringify({
          success: true,
          message: `Demo modunda ${files.length} dosya yükleme simülasyonu tamamlandı. Gerçek dosyalar kaydedilmedi.`,
          data: [],
          demo: true,
          note: 'Bu demo modudur. Dosyalar gerçekte kaydedilmez ve medya kütüphanesinde görünmez.'
        }), {
          headers: {
            'Content-Type': 'application/json',
            ...corsHeaders
          }
        });

      } catch (error) {
        console.error('Upload error:', error);
        return new Response(JSON.stringify({
          success: false,
          error: 'Dosya yükleme sırasında hata oluştu: ' + error.message
        }), {
          status: 500,
          headers: {
            'Content-Type': 'application/json',
            ...corsHeaders
          }
        });
      }
    }

    if (request.method === 'GET') {
      // Return demo mode info
      return new Response(JSON.stringify({
        success: true,
        message: 'Upload API demo modunda çalışıyor',
        demo: true,
        supportedTypes: [
          'image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp',
          'video/mp4', 'video/avi', 'video/mov',
          'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        ],
        maxFileSize: '10MB',
        note: 'Demo modunda dosyalar gerçekte kaydedilmez'
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