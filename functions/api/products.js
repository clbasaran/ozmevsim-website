export async function onRequest(context) {
  const { request, env } = context;
    // Handle CORS
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    };

    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    try {
      const url = new URL(request.url);
      const method = request.method;

      if (method === 'GET') {
        // Get query parameters
        const id = url.searchParams.get('id');
        const status = url.searchParams.get('status') || 'active';

        if (id) {
          // Fetch specific product by ID
          const stmt = env.ozmevsim_d1.prepare(
            'SELECT * FROM products WHERE id = ? AND status = ?'
          );
          const result = await stmt.bind(id, status).first();

          if (!result) {
            return new Response(JSON.stringify({
              success: false,
              error: 'Product not found'
            }), {
              status: 404,
              headers: { 'Content-Type': 'application/json', ...corsHeaders }
            });
          }

          // Parse JSON fields
          const processedProduct = {
            ...result,
            features: typeof result.features === 'string' ? JSON.parse(result.features) : result.features,
            specifications: typeof result.specifications === 'string' ? JSON.parse(result.specifications) : result.specifications,
          };

          return new Response(JSON.stringify({
            success: true,
            data: processedProduct
          }), {
            headers: { 'Content-Type': 'application/json', ...corsHeaders }
          });
        } else {
          // Fetch all products
          const stmt = env.ozmevsim_d1.prepare(
            'SELECT * FROM products WHERE status = ? ORDER BY created_at DESC'
          );
          const { results } = await stmt.bind(status).all();

          // Parse JSON fields
          const processedProducts = results.map(product => ({
            ...product,
            features: typeof product.features === 'string' ? JSON.parse(product.features) : product.features,
            specifications: typeof product.specifications === 'string' ? JSON.parse(product.specifications) : product.specifications,
          }));

          return new Response(JSON.stringify({
            success: true,
            data: processedProducts
          }), {
            headers: { 'Content-Type': 'application/json', ...corsHeaders }
          });
        }

      } else if (method === 'POST') {
        const body = await request.json();
        const { title, description, price, image_url, all_images, category, brand, model, features, specifications, status } = body;

        // Validation
        if (!title || !description) {
          return new Response(JSON.stringify({
            error: 'Title and description are required'
          }), {
            status: 400,
            headers: { 'Content-Type': 'application/json', ...corsHeaders }
          });
        }

        // Create product in D1
        const stmt = env.ozmevsim_d1.prepare(`
          INSERT INTO products (title, description, price, image_url, all_images, category, brand, model, features, specifications, status, created_at, updated_at)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))
        `);

        const result = await stmt.bind(
          title,
          description,
          price || 0,
          image_url || '',
          all_images || '[]',
          category || 'general',
          brand || '',
          model || '',
          JSON.stringify(features || []),
          JSON.stringify(specifications || {}),
          status || 'active'
        ).run();

        if (!result.success) {
          throw new Error('Failed to create product');
        }

        return new Response(JSON.stringify({
          success: true,
          message: 'Product created successfully',
          id: result.meta.last_row_id
        }), {
          headers: { 'Content-Type': 'application/json', ...corsHeaders }
        });

      } else if (method === 'PUT') {
        const body = await request.json();
        const { id, title, description, price, image_url, all_images, category, brand, model, features, specifications, status } = body;

        if (!id) {
          return new Response(JSON.stringify({
            error: 'Product ID is required'
          }), {
            status: 400,
            headers: { 'Content-Type': 'application/json', ...corsHeaders }
          });
        }

        // Update product in D1
        const stmt = env.ozmevsim_d1.prepare(`
          UPDATE products 
          SET title = ?, description = ?, price = ?, image_url = ?, all_images = ?, category = ?, brand = ?, model = ?, features = ?, specifications = ?, status = ?, updated_at = datetime('now')
          WHERE id = ?
        `);

        const result = await stmt.bind(
          title,
          description,
          price || 0,
          image_url || '',
          all_images || '[]',
          category || 'general',
          brand || '',
          model || '',
          JSON.stringify(features || []),
          JSON.stringify(specifications || {}),
          status || 'active',
          id
        ).run();

        if (!result.success) {
          throw new Error('Failed to update product');
        }

        return new Response(JSON.stringify({
          success: true,
          message: 'Product updated successfully'
        }), {
          headers: { 'Content-Type': 'application/json', ...corsHeaders }
        });

      } else if (method === 'DELETE') {
        const body = await request.json();
        const { id } = body;

        if (!id) {
          return new Response(JSON.stringify({
            error: 'Product ID is required'
          }), {
            status: 400,
            headers: { 'Content-Type': 'application/json', ...corsHeaders }
          });
        }

        // Delete product from D1
        const stmt = env.ozmevsim_d1.prepare('DELETE FROM products WHERE id = ?');
        const result = await stmt.bind(id).run();

        if (!result.success) {
          throw new Error('Failed to delete product');
        }

        return new Response(JSON.stringify({
          success: true,
          message: 'Product deleted successfully'
        }), {
          headers: { 'Content-Type': 'application/json', ...corsHeaders }
        });

      } else {
        return new Response(JSON.stringify({
          error: 'Method not allowed'
        }), {
          status: 405,
          headers: { 'Content-Type': 'application/json', ...corsHeaders }
        });
      }

    } catch (error) {
      console.error('Products API Error:', error);
      return new Response(JSON.stringify({
        error: 'Internal server error'
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      });
    }
  } 