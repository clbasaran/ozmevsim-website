'use client';

import React, { useState, useEffect } from 'react';

interface TeamMember {
  id: string;
  name: string;
  position: string;
  bio: string;
  photo: string;
  email: string;
  phone?: string;
  linkedin: string;
  twitter: string;
  experience?: string;
  education?: string;
  certifications?: string[];
  specializations?: string[];
  location?: string;
  languages?: string[];
  achievements?: string[];
  yearsOfExperience?: number;
}

export default function TestTeamPage() {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [lastUpdate, setLastUpdate] = useState<string>('');

  useEffect(() => {
    // No localStorage usage - team members loaded from default state
    setLastUpdate(new Date().toLocaleTimeString());
  }, []);

  const clearStorage = () => {
    setTeamMembers([]);
    setLastUpdate(new Date().toLocaleTimeString());
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Ekip Üyeleri Test Sayfası</h1>
              <p className="text-gray-600">Admin panelden değişiklik yapın, burada gerçek zamanlı görün</p>
              {lastUpdate && (
                <p className="text-sm text-green-600 mt-1">Son güncelleme: {lastUpdate}</p>
              )}
            </div>
            <button
              onClick={clearStorage}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              Temizle
            </button>
          </div>

          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Toplam Ekip Üyesi: {teamMembers.length}
            </h2>
          </div>

          {teamMembers.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">Henüz ekip üyesi yok</p>
              <p className="text-gray-400 text-sm mt-2">
                Admin panelden ekip üyesi ekleyin: 
                <a 
                  href="/admin/pages/about" 
                  className="text-blue-600 hover:underline ml-1"
                  target="_blank"
                >
                  Admin Panel
                </a>
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {teamMembers.map((member) => (
                <div key={member.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center mb-4">
                    {member.photo ? (
                      <img
                        src={member.photo}
                        alt={member.name}
                        className="w-12 h-12 rounded-full object-cover mr-3"
                        onError={(e) => {
                          e.currentTarget.src = 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face';
                        }}
                      />
                    ) : (
                      <div className="w-12 h-12 bg-gray-300 rounded-full mr-3 flex items-center justify-center">
                        <span className="text-gray-600 font-bold">
                          {member.name ? member.name.charAt(0).toUpperCase() : '?'}
                        </span>
                      </div>
                    )}
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {member.name || 'İsimsiz'}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {member.position || 'Pozisyon belirtilmemiş'}
                      </p>
                      {member.yearsOfExperience && (
                        <p className="text-xs text-orange-600">
                          {member.yearsOfExperience} yıl deneyim
                        </p>
                      )}
                      {member.location && (
                        <p className="text-xs text-gray-500">
                          📍 {member.location}
                        </p>
                      )}
                    </div>
                  </div>
                  
                  {member.bio && (
                    <p className="text-gray-700 text-sm mb-3">{member.bio}</p>
                  )}

                  {member.education && (
                    <div className="mb-2">
                      <span className="text-xs font-medium text-gray-800">🎓 Eğitim:</span>
                      <p className="text-xs text-gray-600">{member.education}</p>
                    </div>
                  )}

                  {member.specializations && member.specializations.length > 0 && (
                    <div className="mb-2">
                      <span className="text-xs font-medium text-gray-800">⚡ Uzmanlık:</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {member.specializations.map((spec, index) => (
                          <span key={index} className="text-xs bg-blue-100 text-blue-800 px-1 py-0.5 rounded">
                            {spec}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {member.certifications && member.certifications.length > 0 && (
                    <div className="mb-2">
                      <span className="text-xs font-medium text-gray-800">🏆 Sertifikalar:</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {member.certifications.map((cert, index) => (
                          <span key={index} className="text-xs bg-green-100 text-green-800 px-1 py-0.5 rounded">
                            {cert}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {member.languages && member.languages.length > 0 && (
                    <div className="mb-2">
                      <span className="text-xs font-medium text-gray-800">🌍 Diller:</span>
                      <p className="text-xs text-gray-600">{member.languages.join(', ')}</p>
                    </div>
                  )}

                  {member.achievements && member.achievements.length > 0 && (
                    <div className="mb-2">
                      <span className="text-xs font-medium text-gray-800">🎯 Başarılar:</span>
                      <ul className="text-xs text-gray-600 mt-1">
                        {member.achievements.slice(0, 2).map((achievement, index) => (
                          <li key={index} className="flex items-start gap-1">
                            <span className="text-orange-500">•</span>
                            <span>{achievement}</span>
                          </li>
                        ))}
                        {member.achievements.length > 2 && (
                          <li className="text-gray-400">+{member.achievements.length - 2} daha...</li>
                        )}
                      </ul>
                    </div>
                  )}
                  
                  <div className="space-y-1 pt-2 border-t border-gray-100">
                    {member.email && (
                      <p className="text-blue-600 text-sm">📧 {member.email}</p>
                    )}
                    
                    {member.phone && (
                      <p className="text-green-600 text-sm">📞 {member.phone}</p>
                    )}
                    
                    {member.linkedin && (
                      <a 
                        href={member.linkedin} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 text-sm hover:underline block"
                      >
                        🔗 LinkedIn Profili
                      </a>
                    )}
                    
                    {member.twitter && (
                      <a 
                        href={member.twitter} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-sky-600 text-sm hover:underline block"
                      >
                        🐦 Twitter Profili
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="mt-8 bg-gray-50 rounded-lg p-4">
            <h3 className="font-semibold text-gray-800 mb-2">Debug Bilgileri:</h3>
            <pre className="text-xs text-gray-600 overflow-auto">
              {JSON.stringify(teamMembers, null, 2)}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
} 