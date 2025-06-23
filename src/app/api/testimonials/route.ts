import { NextRequest, NextResponse } from 'next/server';

// Edge runtime for Cloudflare Pages
export const runtime = 'edge';

interface Testimonial {
  id: number;
  name: string;
  title: string;
  company: string;
  location: string;
  rating: number;
  comment: string;
  project: string;
  date: string;
  avatar: string;
  projectType: 'residential' | 'commercial' | 'industrial';
  verified: boolean;
}

// Get D1 database instance
function getD1Database() {
  return (globalThis as any).ozmevsim_d1;
}

// Default testimonials for fallback
const defaultTestimonials: Testimonial[] = [
  {
    id: 1,
    name: 'Ahmet Yılmaz',
    title: 'Villa Sahibi',
    company: 'Özel',
    location: 'Keçiören, Ankara',
    rating: 5,
    comment: 'Öz Mevsim ekibinin profesyonelliği gerçekten takdire şayan. 300 m² villa projemizde tüm ısıtma sistemi kurulumunu gerçekleştirdiler. Vaillant kombi sistemimiz mükemmel çalışıyor, enerji tasarrufu %40 arttı. Kesinlikle tavsiye ederim.',
    project: 'Villa Kombi Sistemi Kurulumu',
    date: '2024-01-15',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
    projectType: 'residential',
    verified: true
  },
  {
    id: 2,
    name: 'Fatma Özdemir',
    title: 'İnsan Kaynakları Müdürü',
    company: 'TechCorp AŞ',
    location: 'Çankaya, Ankara',
    rating: 5,
    comment: '3 katlı ofis binamızın tüm klima sistemlerini yeniledik. Öz Mevsim\'in danışmanlık hizmeti ve teknik ekibi harika. Proje zamanında teslim edildi, çalışanlarımız çok memnun. VRF sistemi harika çalışıyor.',
    project: 'Ofis VRF Klima Sistemi',
    date: '2024-02-08',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face',
    projectType: 'commercial',
    verified: true
  },
  {
    id: 3,
    name: 'Mehmet Kaya',
    title: 'Fabrika Müdürü',
    company: 'Kaya Tekstil',
    location: 'Sincan, Ankara',
    rating: 5,
    comment: '5000 m² fabrika alanımızın ısıtma sistemini tamemen yeniledik. Bosch endüstriyel kombi sistemleri ile enerji maliyetlerimizi %50 düşürdük. Öz Mevsim ekibinin uzmanlığı ve 7/24 teknik desteği mükemmel.',
    project: 'Endüstriyel Isıtma Sistemi',
    date: '2023-12-20',
    avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100&h=100&fit=crop&crop=face',
    projectType: 'industrial',
    verified: true
  },
  {
    id: 4,
    name: 'Ayşe Demir',
    title: 'Ev Hanımı',
    company: 'Özel',
    location: 'Yenimahalle, Ankara',
    rating: 5,
    comment: 'Dairemizin eski kombi sistemini değiştirdik. Demirdöküm kombi ile artık hem daha sıcak hem de daha ekonomik. Kurulum ekibi çok titiz çalıştı, evimizi tertemiz bıraktılar. Teşekkürler!',
    project: 'Daire Kombi Değişimi',
    date: '2024-01-25',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
    projectType: 'residential',
    verified: true
  },
  {
    id: 5,
    name: 'Can Arslan',
    title: 'Otel Müdürü',
    company: 'Grand Hotel Ankara',
    location: 'Kızılay, Ankara',
    rating: 5,
    comment: '120 odalı otelimizin tüm ısıtma ve klima sistemlerini yeniledik. Öz Mevsim\'in proje yönetimi kusursuzdu. Misafirlerimizden sürekli övgü alıyoruz. Enerji verimliliği de %45 arttı.',
    project: 'Otel HVAC Sistemi',
    date: '2023-11-10',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
    projectType: 'commercial',
    verified: true
  }
];

export async function GET(request: NextRequest) {
  try {
    return NextResponse.json({
      success: true,
      data: defaultTestimonials,
      count: defaultTestimonials.length
    });
  } catch (error) {
    console.error('Testimonials API error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch testimonials' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    
    // Validate required fields
    const requiredFields = ['name', 'title', 'comment', 'rating'];
    for (const field of requiredFields) {
      if (!data[field]) {
        return NextResponse.json(
          { success: false, error: `${field} is required` },
          { status: 400 }
        );
      }
    }

    // In a real app, you would save to database
    // For now, just return success
    return NextResponse.json({
      success: true,
      message: 'Testimonial added successfully',
      data: { id: Date.now(), ...data }
    });
  } catch (error) {
    console.error('Testimonials POST error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to add testimonial' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...updateData } = body;
    const db = getD1Database();

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Testimonial ID is required' },
        { status: 400 }
      );
    }

    const now = new Date().toISOString();
    const updatedTestimonial = {
      id,
      name: updateData.name || '',
      title: updateData.title || '',
      company: updateData.company || '',
      content: updateData.content || '',
      rating: updateData.rating || 5,
      avatar: updateData.avatar || '',
      location: updateData.location || '',
      service: updateData.service || '',
      featured: Boolean(updateData.featured),
      status: updateData.status || 'pending',
      createdAt: updateData.createdAt || now,
      updatedAt: now
    };

    if (db) {
      // Update in D1 database
      const stmt = db.prepare(`
        UPDATE testimonials SET 
          name = ?, title = ?, company = ?, content = ?, rating = ?, 
          avatar = ?, location = ?, service = ?, featured = ?, status = ?, updated_at = ?
        WHERE id = ?
      `);
      
      const result = await stmt.bind(
        updatedTestimonial.name,
        updatedTestimonial.title,
        updatedTestimonial.company,
        updatedTestimonial.content,
        updatedTestimonial.rating,
        updatedTestimonial.avatar,
        updatedTestimonial.location,
        updatedTestimonial.service,
        updatedTestimonial.featured ? 1 : 0,
        updatedTestimonial.status,
        updatedTestimonial.updatedAt,
        id
      ).run();

      if (result.changes === 0) {
        return NextResponse.json(
          { success: false, error: 'Testimonial not found' },
          { status: 404 }
        );
      }
    }

    return NextResponse.json({
      success: true,
      data: updatedTestimonial,
      message: 'Testimonial updated successfully'
    });
  } catch (error) {
    console.error('Testimonials PUT error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update testimonial' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const db = getD1Database();

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Testimonial ID is required' },
        { status: 400 }
      );
    }

    if (db) {
      // Delete from D1 database
      const stmt = db.prepare('DELETE FROM testimonials WHERE id = ?');
      const result = await stmt.bind(id).run();

      if (result.changes === 0) {
        return NextResponse.json(
          { success: false, error: 'Testimonial not found' },
          { status: 404 }
        );
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Testimonial deleted successfully'
    });
  } catch (error) {
    console.error('Testimonials DELETE error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete testimonial' },
      { status: 500 }
    );
  }
} 