import { NextRequest, NextResponse } from 'next/server';

// Edge runtime for Cloudflare Pages
export const runtime = 'edge';

interface Testimonial {
  id: string;
  name: string;
  title?: string;
  company?: string;
  content: string;
  rating: number;
  avatar?: string;
  location?: string;
  service: string;
  featured: boolean;
  status: 'published' | 'draft' | 'pending';
  createdAt: string;
  updatedAt: string;
}

// In-memory storage (in production, use a database)
let testimonials: Testimonial[] = [
  {
    id: '1',
    name: 'Mehmet Yılmaz',
    title: 'Ev Sahibi',
    content: 'Öz Mevsim ekibi ile çalışmak gerçekten harika bir deneyimdi. Kombi montajını çok profesyonel bir şekilde yaptılar. Hem hızlı hem de temiz çalışıyorlar. Kesinlikle tavsiye ederim.',
    rating: 5,
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
    location: 'Kadıköy, İstanbul',
    service: 'Kombi Montajı',
    featured: true,
    status: 'published',
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z'
  },
  {
    id: '2',
    name: 'Ayşe Demir',
    title: 'Ev Sahibi',
    content: 'Kombinim arızalandığında hemen arayıp gelip sorunu çözdüler. 7/24 hizmet vermeleri çok güzel. Fiyatları da çok makul. Teşekkürler Öz Mevsim ailesi.',
    rating: 5,
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face',
    location: 'Üsküdar, İstanbul',
    service: 'Kombi Onarımı',
    featured: true,
    status: 'published',
    createdAt: '2024-01-14T10:00:00Z',
    updatedAt: '2024-01-14T10:00:00Z'
  },
  {
    id: '3',
    name: 'Ali Kaya',
    title: 'İşletme Sahibi',
    company: 'Kaya Restoran',
    content: 'Restoranımızın ısıtma sistemini yeniledik. Çok detaylı bir çalışma yaptılar. Sistem şimdi çok daha verimli çalışıyor. Profesyonel yaklaşımları için teşekkürler.',
    rating: 5,
    avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100&h=100&fit=crop&crop=face',
    location: 'Beyoğlu, İstanbul',
    service: 'Ticari Isıtma Sistemi',
    featured: false,
    status: 'published',
    createdAt: '2024-01-13T10:00:00Z',
    updatedAt: '2024-01-13T10:00:00Z'
  },
  {
    id: '4',
    name: 'Fatma Özkan',
    title: 'Ev Sahibi',
    content: 'Yıllık bakım hizmeti için geldiler. Çok titiz bir şekilde tüm sistemi kontrol ettiler. Kombinim şimdi çok daha sessiz çalışıyor. Memnun kaldım.',
    rating: 4,
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
    location: 'Maltepe, İstanbul',
    service: 'Kombi Bakımı',
    featured: false,
    status: 'published',
    createdAt: '2024-01-12T10:00:00Z',
    updatedAt: '2024-01-12T10:00:00Z'
  },
  {
    id: '5',
    name: 'Hasan Çelik',
    title: 'Ev Sahibi',
    content: 'Klima montajı için çağırdık. Randevu saatinde geldiler ve işlerini çok özenli yaptılar. Fiyat performans açısından çok başarılılar. Tavsiye ederim.',
    rating: 5,
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
    location: 'Kartal, İstanbul',
    service: 'Klima Montajı',
    featured: false,
    status: 'published',
    createdAt: '2024-01-11T10:00:00Z',
    updatedAt: '2024-01-11T10:00:00Z'
  }
];

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const service = searchParams.get('service');
  const status = searchParams.get('status');
  const featured = searchParams.get('featured');
  const rating = searchParams.get('rating');

  try {
    let filteredTestimonials = [...testimonials];

    if (service && service !== 'all') {
      filteredTestimonials = filteredTestimonials.filter(testimonial => 
        testimonial.service.toLowerCase().includes(service.toLowerCase())
      );
    }

    if (status && status !== 'all') {
      filteredTestimonials = filteredTestimonials.filter(testimonial => testimonial.status === status);
    }

    if (featured === 'true') {
      filteredTestimonials = filteredTestimonials.filter(testimonial => testimonial.featured);
    }

    if (rating) {
      const minRating = parseInt(rating);
      filteredTestimonials = filteredTestimonials.filter(testimonial => testimonial.rating >= minRating);
    }

    // Sort by creation date (newest first)
    filteredTestimonials.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return NextResponse.json({
      success: true,
      data: filteredTestimonials,
      total: filteredTestimonials.length
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch testimonials' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const newTestimonial: Testimonial = {
      id: Date.now().toString(),
      ...body,
      status: body.status || 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    testimonials.push(newTestimonial);

    return NextResponse.json({
      success: true,
      data: newTestimonial,
      message: 'Testimonial created successfully'
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to create testimonial' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...updateData } = body;

    const testimonialIndex = testimonials.findIndex(testimonial => testimonial.id === id);
    if (testimonialIndex === -1) {
      return NextResponse.json(
        { success: false, error: 'Testimonial not found' },
        { status: 404 }
      );
    }

    testimonials[testimonialIndex] = {
      ...testimonials[testimonialIndex],
      ...updateData,
      updatedAt: new Date().toISOString()
    };

    return NextResponse.json({
      success: true,
      data: testimonials[testimonialIndex],
      message: 'Testimonial updated successfully'
    });
  } catch (error) {
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

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Testimonial ID is required' },
        { status: 400 }
      );
    }

    const testimonialIndex = testimonials.findIndex(testimonial => testimonial.id === id);
    if (testimonialIndex === -1) {
      return NextResponse.json(
        { success: false, error: 'Testimonial not found' },
        { status: 404 }
      );
    }

    testimonials.splice(testimonialIndex, 1);

    return NextResponse.json({
      success: true,
      message: 'Testimonial deleted successfully'
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to delete testimonial' },
      { status: 500 }
    );
  }
} 