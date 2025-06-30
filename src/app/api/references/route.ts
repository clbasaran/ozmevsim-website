import { NextRequest, NextResponse } from 'next/server';

// Force dynamic rendering
export const dynamic = 'force-dynamic';
// Edge runtime for Cloudflare Pages
export const runtime = 'edge';

interface Reference {
  id: number;
  title: string;
  description: string;
  client: string;
  location: string;
  category: string;
  completedDate: string;
  image: string;
  status: 'active' | 'inactive';
  featured: boolean;
  rating: number;
  createdAt: string;
  updatedAt: string;
}

const defaultReferences: Reference[] = [
  {
    id: 1,
    title: 'Residence Villa Kompleksi',
    description: 'Ankara\'nın prestijli bölgelerinden birinde yer alan villa kompleksimizde 50 villa için kombi ve radyatör sistemleri kurduk. Vaillant ecoTEC Plus kombiler ve Purmo panel radyatörler ile mükemmel ısıtma konforu sağladık.',
    client: 'Residence İnşaat',
    location: 'Çankaya, Ankara',
    category: 'Konut',
    completedDate: '2024-01-15',
    image: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800&h=600&fit=crop',
    status: 'active',
    featured: true,
    rating: 5,
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z'
  },
  {
    id: 2,
    title: 'Metro AVM Otopark Isıtma',
    description: 'Ankara\'nın en büyük AVM\'lerinden Metro AVM\'nin otopark alanları için geothermal ısı pompa sistemi kurduk. 15,000 m² alan için enerji verimli çözüm sağladık.',
    client: 'Metro Holding',
    location: 'Kızılay, Ankara',
    category: 'Ticari',
    completedDate: '2023-11-20',
    image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=600&fit=crop',
    status: 'active',
    featured: true,
    rating: 5,
    createdAt: '2023-11-20T14:30:00Z',
    updatedAt: '2023-11-20T14:30:00Z'
  },
  {
    id: 3,
    title: 'ODTÜ Teknokent Ofis Bloğu',
    description: 'ODTÜ Teknokent\'te yer alan 8 katlı ofis bloğu için merkezi klima ve ısıtma sistemi kurduk. Daikin VRV sistemleri ile 4 mevsim konfor sağladık.',
    client: 'ODTÜ Teknokent',
    location: 'ODTÜ, Ankara',
    category: 'Ticari',
    completedDate: '2023-09-10',
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&h=600&fit=crop',
    status: 'active',
    featured: true,
    rating: 5,
    createdAt: '2023-09-10T09:15:00Z',
    updatedAt: '2023-09-10T09:15:00Z'
  },
  {
    id: 4,
    title: 'Ankara Şehir Hastanesi Ek Bina',
    description: 'Ankara Şehir Hastanesi ek binasında medikal gaz sistemleri ve özel iklim kontrol sistemleri kurduk. 24/7 kesintisiz hizmet için yedekli sistemler tasarladık.',
    client: 'Sağlık Bakanlığı',
    location: 'Bilkent, Ankara',
    category: 'Kamu',
    completedDate: '2023-07-25',
    image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800&h=600&fit=crop',
    status: 'active',
    featured: true,
    rating: 5,
    createdAt: '2023-07-25T16:45:00Z',
    updatedAt: '2023-07-25T16:45:00Z'
  },
  {
    id: 5,
    title: 'Ford Otosan Fabrika Genişleme',
    description: 'Ford Otosan fabrikasının genişletme projesinde endüstriyel ısıtma ve soğutma sistemleri kurduk. 25,000 m² üretim alanı için enerji verimli çözümler uyguladık.',
    client: 'Ford Otosan',
    location: 'Gölbaşı, Ankara',
    category: 'Endüstriyel',
    completedDate: '2023-05-12',
    image: 'https://images.unsplash.com/photo-1565344138032-c19ae5c93208?w=800&h=600&fit=crop',
    status: 'active',
    featured: true,
    rating: 5,
    createdAt: '2023-05-12T11:20:00Z',
    updatedAt: '2023-05-12T11:20:00Z'
  },
  {
    id: 6,
    title: 'Optimum Outlet Klima Sistemi',
    description: 'Optimum Outlet AVM\'de merkezi klima sisteminin yenilenmesi ve modernizasyonu projesi. VRF sistemleri ile %40 enerji tasarrufu sağladık.',
    client: 'Optimum AVM',
    location: 'Söğütözü, Ankara',
    category: 'Ticari',
    completedDate: '2023-03-08',
    image: 'https://images.unsplash.com/photo-1555636222-cae831e670b3?w=800&h=600&fit=crop',
    status: 'active',
    featured: false,
    rating: 4,
    createdAt: '2023-03-08T13:10:00Z',
    updatedAt: '2023-03-08T13:10:00Z'
  }
];

// GET - Fetch all references or by query parameters
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const featured = searchParams.get('featured');
    const category = searchParams.get('category');
    const status = searchParams.get('status') || 'active';

    let filteredReferences = defaultReferences;

    // Filter by status
    if (status) {
      filteredReferences = filteredReferences.filter(ref => ref.status === status);
    }

    // Filter by featured
    if (featured === 'true') {
      filteredReferences = filteredReferences.filter(ref => ref.featured);
    }

    // Filter by category
    if (category && category !== 'all') {
      filteredReferences = filteredReferences.filter(ref => ref.category === category);
    }

    return NextResponse.json({ 
      success: true, 
      data: filteredReferences,
      count: filteredReferences.length
    });

  } catch (error) {
    console.error('Error fetching references:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch references' },
      { status: 500 }
    );
  }
}

// POST - Create new reference
export async function POST(request: NextRequest) {
  try {
    const env = process.env as any;
    if (!env.DB) {
      return NextResponse.json({ 
        success: false, 
        error: 'Database not available' 
      });
    }

    const data: Omit<Reference, 'id' | 'createdAt' | 'updatedAt'> = await request.json();
    
    const now = new Date().toISOString();
    const newId = Math.max(...defaultReferences.map(r => r.id)) + 1;
    
    const newReference: Reference = {
      ...data,
      id: newId,
      createdAt: now,
      updatedAt: now
    };

    // In a real app, save to database
    defaultReferences.push(newReference);

    return NextResponse.json({ 
      success: true, 
      data: newReference,
      message: 'Reference created successfully'
    });

  } catch (error) {
    console.error('Error creating reference:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create reference' },
      { status: 500 }
    );
  }
}

// PUT - Update reference
export async function PUT(request: NextRequest) {
  try {
    const env = process.env as any;
    if (!env.DB) {
      return NextResponse.json({ 
        success: false, 
        error: 'Database not available' 
      });
    }

    const data: Reference & { id: number } = await request.json();
    
    if (!data.id) {
      return NextResponse.json({ 
        success: false, 
        error: 'Reference ID is required' 
      });
    }

    const index = defaultReferences.findIndex(r => r.id === data.id);
    if (index === -1) {
      return NextResponse.json({ 
        success: false, 
        error: 'Reference not found' 
      });
    }

    const updatedReference = {
      ...defaultReferences[index],
      ...data,
      updatedAt: new Date().toISOString()
    };

    defaultReferences[index] = updatedReference;

    return NextResponse.json({ 
      success: true, 
      data: updatedReference,
      message: 'Reference updated successfully'
    });

  } catch (error) {
    console.error('Error updating reference:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update reference' },
      { status: 500 }
    );
  }
}

// DELETE - Delete reference
export async function DELETE(request: NextRequest) {
  try {
    const env = process.env as any;
    if (!env.DB) {
      return NextResponse.json({ 
        success: false, 
        error: 'Database not available' 
      });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json({ 
        success: false, 
        error: 'Reference ID is required' 
      });
    }

    const index = defaultReferences.findIndex(r => r.id === parseInt(id));
    if (index === -1) {
      return NextResponse.json({ 
        success: false, 
        error: 'Reference not found' 
      });
    }

    defaultReferences.splice(index, 1);

    return NextResponse.json({ 
      success: true, 
      message: 'Reference deleted successfully' 
    });

  } catch (error) {
    console.error('Error deleting reference:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete reference' },
      { status: 500 }
    );
  }
} 