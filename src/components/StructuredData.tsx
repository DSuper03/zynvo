'use client';

type WebsiteSchema = {
  name: string;
  description: string;
  url: string;
};

type OrganizationSchema = {
  name: string;
  description: string;
  logo: string;
};

type EventSchema = {
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  location: string;
  organizer: string;
};

type ClubSchema = {
  name: string;
  description: string;
  foundingDate: string;
  location: string;
  members: number;
};

interface StructuredDataProps {
  type: 'website' | 'organization' | 'event' | 'club';
  data: WebsiteSchema | OrganizationSchema | EventSchema | ClubSchema;
}

const StructuredData: React.FC<StructuredDataProps> = ({ type, data }) => {
  const getSchema = () => {
    switch (type) {
      case 'website':
        return {
          '@context': 'https://schema.org',
          '@type': 'WebSite',
          name: (data as WebsiteSchema).name,
          description: (data as WebsiteSchema).description,
          url: (data as WebsiteSchema).url,
        };
      case 'organization':
        return {
          '@context': 'https://schema.org',
          '@type': 'Organization',
          name: (data as OrganizationSchema).name,
          description: (data as OrganizationSchema).description,
          logo: (data as OrganizationSchema).logo,
        };
      case 'event':
        return {
          '@context': 'https://schema.org',
          '@type': 'Event',
          name: (data as EventSchema).name,
          description: (data as EventSchema).description,
          startDate: (data as EventSchema).startDate,
          endDate: (data as EventSchema).endDate,
          location: {
            '@type': 'Place',
            name: (data as EventSchema).location,
          },
          organizer: {
            '@type': 'Organization',
            name: (data as EventSchema).organizer,
          },
        };
      case 'club':
        return {
          '@context': 'https://schema.org',
          '@type': 'Organization',
          '@subtype': 'Club',
          name: (data as ClubSchema).name,
          description: (data as ClubSchema).description,
          foundingDate: (data as ClubSchema).foundingDate,
          location: (data as ClubSchema).location,
          memberCount: (data as ClubSchema).members,
        };
    }
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(getSchema()) }}
    />
  );
};

export default StructuredData; 