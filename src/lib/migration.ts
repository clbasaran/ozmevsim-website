// Migration utility to transfer localStorage data to database
// Öz Mevsim sitenin localStorage verilerini database'e aktarma sistemi

interface MigrationResult {
  success: boolean;
  message: string;
  details?: any;
}

export class DataMigration {
  
  // localStorage'daki tüm özmevsim verilerini topla
  static getAllLocalStorageData(): Record<string, any> {
    const data: Record<string, any> = {};
    
    if (typeof window === 'undefined') {
      return data;
    }
    
    // Tüm ozmevsim_ ile başlayan key'leri topla
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('ozmevsim_')) {
        try {
          const value = localStorage.getItem(key);
          if (value) {
            data[key] = JSON.parse(value);
          }
        } catch (error) {
          console.warn(`Failed to parse localStorage key: ${key}`, error);
          data[key] = localStorage.getItem(key); // Store as string if JSON parse fails
        }
      }
    }
    
    return data;
  }
  
  // Products migration
  static async migrateProducts(): Promise<MigrationResult> {
    try {
      const products = localStorage.getItem('ozmevsim_products');
      if (!products) {
        return { success: false, message: 'Ürün verisi bulunamadı' };
      }
      
      const productList = JSON.parse(products);
      console.log('Migrating products:', productList.length);
      
      let successCount = 0;
      let errorCount = 0;
      const errors: string[] = [];
      
      for (const product of productList) {
        try {
          const response = await fetch('/api/products', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              title: product.name || product.title,
              description: product.description,
              price: product.price || 0,
              image_url: product.image || product.image_url,
              category: product.category,
              brand: product.brand,
              model: product.model,
              features: product.features || [],
              specifications: product.specifications || {},
              status: product.isActive !== false ? 'active' : 'inactive'
            })
          });
          
          if (response.ok) {
            successCount++;
          } else {
            errorCount++;
            const errorData = await response.text();
            errors.push(`Product ${product.name}: ${errorData}`);
          }
        } catch (error) {
          errorCount++;
          errors.push(`Product ${product.name}: ${error}`);
        }
      }
      
      return {
        success: errorCount === 0,
        message: `${successCount} ürün başarıyla aktarıldı, ${errorCount} hata`,
        details: { successCount, errorCount, errors }
      };
      
    } catch (error) {
      return {
        success: false,
        message: `Ürün migrasyonunda hata: ${error}`,
        details: error
      };
    }
  }
  
  // Blog posts migration
  static async migrateBlogPosts(): Promise<MigrationResult> {
    try {
      const blogPosts = localStorage.getItem('ozmevsim_blog_posts');
      if (!blogPosts) {
        return { success: false, message: 'Blog verisi bulunamadı' };
      }
      
      const postList = JSON.parse(blogPosts);
      console.log('Migrating blog posts:', postList.length);
      
      let successCount = 0;
      let errorCount = 0;
      const errors: string[] = [];
      
      for (const post of postList) {
        try {
          const response = await fetch('/api/blog', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              title: post.title,
              content: post.content,
              excerpt: post.excerpt,
              featured_image: post.featuredImage || post.featured_image,
              author: post.author || 'Admin',
              status: post.status || 'published',
              tags: post.tags || []
            })
          });
          
          if (response.ok) {
            successCount++;
          } else {
            errorCount++;
            const errorData = await response.text();
            errors.push(`Post ${post.title}: ${errorData}`);
          }
        } catch (error) {
          errorCount++;
          errors.push(`Post ${post.title}: ${error}`);
        }
      }
      
      return {
        success: errorCount === 0,
        message: `${successCount} blog yazısı başarıyla aktarıldı, ${errorCount} hata`,
        details: { successCount, errorCount, errors }
      };
      
    } catch (error) {
      return {
        success: false,
        message: `Blog migrasyonunda hata: ${error}`,
        details: error
      };
    }
  }
  
  // FAQ migration
  static async migrateFAQs(): Promise<MigrationResult> {
    try {
      const faqs = localStorage.getItem('ozmevsim_faqs');
      if (!faqs) {
        return { success: false, message: 'SSS verisi bulunamadı' };
      }
      
      const faqList = JSON.parse(faqs);
      console.log('Migrating FAQs:', faqList.length);
      
      let successCount = 0;
      let errorCount = 0;
      const errors: string[] = [];
      
      for (const faq of faqList) {
        try {
          const response = await fetch('/api/faq', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              question: faq.question,
              answer: faq.answer,
              category: faq.category || 'general',
              order_index: faq.order || faq.order_index || 0,
              status: faq.isActive !== false ? 'active' : 'inactive'
            })
          });
          
          if (response.ok) {
            successCount++;
          } else {
            errorCount++;
            const errorData = await response.text();
            errors.push(`FAQ ${faq.question}: ${errorData}`);
          }
        } catch (error) {
          errorCount++;
          errors.push(`FAQ ${faq.question}: ${error}`);
        }
      }
      
      return {
        success: errorCount === 0,
        message: `${successCount} SSS başarıyla aktarıldı, ${errorCount} hata`,
        details: { successCount, errorCount, errors }
      };
      
    } catch (error) {
      return {
        success: false,
        message: `SSS migrasyonunda hata: ${error}`,
        details: error
      };
    }
  }
  
  // Testimonials migration
  static async migrateTestimonials(): Promise<MigrationResult> {
    try {
      const testimonials = localStorage.getItem('ozmevsim_testimonials');
      if (!testimonials) {
        return { success: false, message: 'Testimonial verisi bulunamadı' };
      }
      
      const testimonialList = JSON.parse(testimonials);
      console.log('Migrating testimonials:', testimonialList.length);
      
      let successCount = 0;
      let errorCount = 0;
      const errors: string[] = [];
      
      for (const testimonial of testimonialList) {
        try {
          const response = await fetch('/api/testimonials', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              name: testimonial.name,
              company: testimonial.company,
              position: testimonial.position || testimonial.title,
              content: testimonial.content || testimonial.message,
              rating: testimonial.rating || 5,
              avatar_url: testimonial.avatar || testimonial.avatar_url,
              status: testimonial.isActive !== false ? 'active' : 'inactive'
            })
          });
          
          if (response.ok) {
            successCount++;
          } else {
            errorCount++;
            const errorData = await response.text();
            errors.push(`Testimonial ${testimonial.name}: ${errorData}`);
          }
        } catch (error) {
          errorCount++;
          errors.push(`Testimonial ${testimonial.name}: ${error}`);
        }
      }
      
      return {
        success: errorCount === 0,
        message: `${successCount} testimonial başarıyla aktarıldı, ${errorCount} hata`,
        details: { successCount, errorCount, errors }
      };
      
    } catch (error) {
      return {
        success: false,
        message: `Testimonial migrasyonunda hata: ${error}`,
        details: error
      };
    }
  }
  
  // Tüm verileri migrate et
  static async migrateAll(): Promise<MigrationResult[]> {
    console.log('🚀 Starting full data migration...');
    
    const results: MigrationResult[] = [];
    
    // Migration sırası önemli (önce temel veriler)
    try {
      console.log('📦 Migrating products...');
      results.push(await this.migrateProducts());
      
      console.log('📝 Migrating blog posts...');
      results.push(await this.migrateBlogPosts());
      
      console.log('❓ Migrating FAQs...');
      results.push(await this.migrateFAQs());
      
      console.log('💬 Migrating testimonials...');
      results.push(await this.migrateTestimonials());
      
      console.log('✅ Migration completed!');
    } catch (error) {
      console.error('❌ Migration failed:', error);
      results.push({
        success: false,
        message: `Migration process failed: ${error}`,
        details: error
      });
    }
    
    return results;
  }
  
  // Migration durumunu kontrol et
  static async checkMigrationStatus(): Promise<{
    localStorageData: Record<string, any>;
    databaseStatus: Record<string, any>;
  }> {
    const localStorageData = this.getAllLocalStorageData();
    const databaseStatus: Record<string, any> = {};
    
    // Database'deki verileri kontrol et
    try {
      const productsResponse = await fetch('/api/products');
      databaseStatus.products = productsResponse.ok ? await productsResponse.json() : { error: 'Failed to fetch' };
      
      const blogResponse = await fetch('/api/blog');
      databaseStatus.blog = blogResponse.ok ? await blogResponse.json() : { error: 'Failed to fetch' };
      
      const faqResponse = await fetch('/api/faq');
      databaseStatus.faq = faqResponse.ok ? await faqResponse.json() : { error: 'Failed to fetch' };
      
      const testimonialsResponse = await fetch('/api/testimonials');
      databaseStatus.testimonials = testimonialsResponse.ok ? await testimonialsResponse.json() : { error: 'Failed to fetch' };
      
    } catch (error) {
      databaseStatus.error = `Failed to check database: ${error}`;
    }
    
    return {
      localStorageData,
      databaseStatus
    };
  }
}

export default DataMigration;