import { NextRequest, NextResponse } from 'next/server';
import { SKI_RESORTS, fetchWeatherForResort } from '@/services/dataService';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const slug = searchParams.get('slug');

  try {
    if (slug) {
      const resort = SKI_RESORTS.find(r => r.slug === slug);
      if (!resort) {
        return NextResponse.json({ error: 'Resort not found' }, { status: 404 });
      }
      const weather = await fetchWeatherForResort(resort);
      return NextResponse.json({ resort, weather });
    }

    // Retornar todos los reportes
    const promises = SKI_RESORTS.map(async (resort) => {
      const weather = await fetchWeatherForResort(resort);
      return { resort, weather };
    });

    const results = await Promise.all(promises);
    return NextResponse.json(results);
  } catch (error) {
    console.error('Error in Weather API Route:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
