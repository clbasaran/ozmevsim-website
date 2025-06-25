const defaultTeam = [
  {
    id: 1,
    name: 'Mehmet Özkan',
    position: 'Kurucu & Genel Müdür',
    description: 'Ankara\'da 25 yıllık deneyimi olan ısıtma sistemleri uzmanı. Öz Mevsim\'i kurarak sektörde güvenilir bir marka haline getirdi.',
    image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=400&fit=crop&face',
    email: 'mehmet@ozmevsim.com',
    phone: '+90 312 357 0600',
    specialties: ['Proje Yönetimi', 'İş Geliştirme', 'Müşteri İlişkileri'],
    experience: '25+ Yıl',
    status: 'active',
    featured: true,
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 2,
    name: 'Ahmet Demir',
    position: 'Teknik Müdür',
    description: 'Makine mühendisi. Kombi, klima ve doğalgaz tesisatı konularında 20+ yıl deneyimi olan teknik ekip lideri.',
    image: 'https://images.unsplash.com/photo-1559548331-f9cb98001426?w=400&h=400&fit=crop&face',
    email: 'ahmet@ozmevsim.com',
    phone: '+90 312 357 0601',
    specialties: ['Kombi Sistemleri', 'Klima Teknolojileri', 'Doğalgaz Tesisatı'],
    experience: '20+ Yıl',
    status: 'active',
    featured: true,
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 3,
    name: 'Fatma Kaya',
    position: 'Montaj Ekip Lideri',
    description: 'Saha deneyimi olan montaj uzmanı. Tüm marka kombi ve klima sistemlerinin kurulumu konusunda sertifikalı.',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop&face',
    email: 'fatma@ozmevsim.com',
    phone: '+90 312 357 0602',
    specialties: ['Kombi Montajı', 'Klima Kurulumu', 'Sistem Testleri'],
    experience: '15+ Yıl',
    status: 'active',
    featured: true,
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 4,
    name: 'Özlem Çelik',
    position: 'Müşteri Hizmetleri Uzmanı',
    description: 'Müşteri memnuniyeti odaklı çalışan deneyimli müşteri hizmetleri uzmanı. 7/24 destek sağlar.',
    image: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=400&h=400&fit=crop&face',
    email: 'ozlem@ozmevsim.com',
    phone: '+90 312 357 0603',
    specialties: ['Müşteri İlişkileri', 'Teknik Destek', 'Randevu Yönetimi'],
    experience: '8+ Yıl',
    status: 'active',
    featured: true,
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 5,
    name: 'Serkan Yılmaz',
    position: 'Servis Teknisyeni',
    description: 'Tüm marka kombi ve klima sistemlerinin bakım ve onarımı konusunda sertifikalı teknisyen.',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&face',
    email: 'serkan@ozmevsim.com',
    phone: '+90 312 357 0604',
    specialties: ['Bakım & Onarım', 'Arıza Tespiti', 'Yedek Parça'],
    experience: '12+ Yıl',
    status: 'active',
    featured: false,
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  }
];

// GET - Fetch all team members or by query parameters
export async function onRequestGet(context) {
  try {
    const { request } = context;
    const url = new URL(request.url);
    const featured = url.searchParams.get('featured');
    const position = url.searchParams.get('position');
    const status = url.searchParams.get('status') || 'active';

    let filteredTeam = defaultTeam;

    // Filter by status
    if (status) {
      filteredTeam = filteredTeam.filter(member => member.status === status);
    }

    // Filter by featured
    if (featured === 'true') {
      filteredTeam = filteredTeam.filter(member => member.featured);
    }

    // Filter by position
    if (position && position !== 'all') {
      filteredTeam = filteredTeam.filter(member => 
        member.position.toLowerCase().includes(position.toLowerCase())
      );
    }

    return Response.json({ 
      success: true, 
      data: filteredTeam,
      count: filteredTeam.length
    });

  } catch (error) {
    console.error('Error fetching team members:', error);
    return Response.json(
      { success: false, error: 'Failed to fetch team members' },
      { status: 500 }
    );
  }
}

// POST - Create new team member (placeholder)
export async function onRequestPost(context) {
  try {
    return Response.json({ 
      success: true, 
      message: 'Team member creation endpoint - functionality to be implemented'
    });
  } catch (error) {
    console.error('Error creating team member:', error);
    return Response.json(
      { success: false, error: 'Failed to create team member' },
      { status: 500 }
    );
  }
}

// PUT - Update team member (placeholder)
export async function onRequestPut(context) {
  try {
    return Response.json({ 
      success: true, 
      message: 'Team member update endpoint - functionality to be implemented'
    });
  } catch (error) {
    console.error('Error updating team member:', error);
    return Response.json(
      { success: false, error: 'Failed to update team member' },
      { status: 500 }
    );
  }
}

// DELETE - Delete team member (placeholder)
export async function onRequestDelete(context) {
  try {
    return Response.json({ 
      success: true, 
      message: 'Team member deletion endpoint - functionality to be implemented'
    });
  } catch (error) {
    console.error('Error deleting team member:', error);
    return Response.json(
      { success: false, error: 'Failed to delete team member' },
      { status: 500 }
    );
  }
} 