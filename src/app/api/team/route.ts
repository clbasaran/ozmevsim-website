import { NextRequest, NextResponse } from 'next/server';

// Force dynamic rendering
export const dynamic = 'force-dynamic';
// Edge runtime for Cloudflare Pages
export const runtime = 'edge';

interface TeamMember {
  id: number;
  name: string;
  title: string;
  description: string;
  image: string;
  phone?: string;
  email?: string;
  linkedin?: string;
  experience: number;
  specialties: string[];
  featured: boolean;
  active: boolean;
  order: number;
}

const defaultTeam: TeamMember[] = [
  {
    id: 1,
    name: 'Ahmet Özcan',
    title: 'Kurucu & Genel Müdür',
    description: '25 yıllık deneyimi ile ısı sistemleri sektöründe öncü. Müşteri memnuniyeti odaklı yaklaşımıyla sektörde saygın bir konuma sahip.',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face',
    phone: '+90 312 357 0600',
    email: 'ahmet@ozmevsim.com',
    linkedin: 'https://linkedin.com/in/ahmet-ozcan',
    experience: 25,
    specialties: ['Proje Yönetimi', 'İş Geliştirme', 'Müşteri İlişkileri'],
    featured: true,
    active: true,
    order: 1
  },
  {
    id: 2,
    name: 'Mehmet Kaya',
    title: 'Teknik Müdür',
    description: 'Makine mühendisi olan Mehmet Bey, 15 yıldır kombi ve klima sistemleri konusunda uzmanlık yapmaktadır.',
    image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=400&fit=crop&crop=face',
    phone: '+90 312 357 0601',
    email: 'mehmet@ozmevsim.com',
    experience: 15,
    specialties: ['Kombi Sistemleri', 'HVAC', 'Enerji Verimliliği'],
    featured: true,
    active: true,
    order: 2
  },
  {
    id: 3,
    name: 'Ali Demir',
    title: 'Montaj Ekip Lideri',
    description: '12 yıllık montaj deneyimi ile kusursuz kurulum hizmetleri sunar. Detay odaklı çalışma prensibi ile tanınır.',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face',
    phone: '+90 312 357 0602',
    email: 'ali@ozmevsim.com',
    experience: 12,
    specialties: ['Montaj', 'Kurulum', 'Bakım'],
    featured: false,
    active: true,
    order: 3
  },
  {
    id: 4,
    name: 'Fatma Şahin',
    title: 'Müşteri Hizmetleri Uzmanı',
    description: 'Müşteri memnuniyeti konusunda uzman. 7/24 destek hattımızda müşterilerimize hizmet vermektedir.',
    image: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop&crop=face',
    phone: '+90 312 357 0603',
    email: 'fatma@ozmevsim.com',
    experience: 8,
    specialties: ['Müşteri Hizmetleri', 'Danışmanlık', 'Teknik Destek'],
    featured: false,
    active: true,
    order: 4
  },
  {
    id: 5,
    name: 'Can Yılmaz',
    title: 'Servis Teknisyeni',
    description: 'Arıza giderme ve bakım konularında uzman teknisyen. Hızlı ve etkili çözümler üretir.',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face',
    phone: '+90 312 357 0604',
    email: 'can@ozmevsim.com',
    experience: 6,
    specialties: ['Arıza Giderme', 'Bakım', 'Onarım'],
    featured: false,
    active: true,
    order: 5
  }
];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const featured = searchParams.get('featured');
    
    let filteredTeam = defaultTeam.filter(member => member.active);
    
    if (featured === 'true') {
      filteredTeam = filteredTeam.filter(member => member.featured);
    }
    
    filteredTeam.sort((a, b) => a.order - b.order);

    return NextResponse.json({ 
      success: true, 
      data: filteredTeam,
      count: filteredTeam.length
    });
  } catch (error) {
    console.error('Team API error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch team members' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    
    // Validate required fields
    const requiredFields = ['name', 'title', 'description'];
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
      message: 'Team member added successfully',
      data: { id: Date.now(), ...data }
    });
  } catch (error) {
    console.error('Team POST error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to add team member' },
      { status: 500 }
    );
  }
}

// PUT - Update team member
export async function PUT(request: NextRequest) {
  try {
    const data = await request.json();
    
    if (!data.id) {
      return NextResponse.json({ 
        success: false, 
        error: 'Team member ID is required' 
      }, { status: 400 });
    }

    // In a real app, you would update in database
    // For now, just return success
    return NextResponse.json({ 
      success: true, 
      message: 'Team member updated successfully',
      data: data 
    });
  } catch (error) {
    console.error('Team PUT error:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to update team member' 
    }, { status: 500 });
  }
}

// DELETE - Delete team member
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json({ 
        success: false, 
        error: 'Team member ID is required' 
      }, { status: 400 });
    }

    // In a real app, you would delete from database
    // For now, just return success
    return NextResponse.json({ 
      success: true, 
      message: 'Team member deleted successfully' 
    });
  } catch (error) {
    console.error('Team DELETE error:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to delete team member' 
    }, { status: 500 });
  }
} 