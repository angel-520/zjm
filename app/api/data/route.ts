import { NextRequest, NextResponse } from 'next/server';

// CORS headers
const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

// Handle OPTIONS preflight requests
export async function OPTIONS() {
    return new NextResponse(null, { headers: corsHeaders });
}

// 定义数据接口
interface ChannelData {
    voltage1: number;
    current1: number;
    voltage2: number;
    current2: number;
}

// 存储最新数据的变量（实际项目中可能使用数据库）
let latestData: ChannelData = {
    voltage1: 0,
    current1: 0,
    voltage2: 0,
    current2: 0
};

// POST 请求 - 接收数据
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        
        // 验证数据格式
        if (typeof body.voltage1 !== 'number' || 
                typeof body.current1 !== 'number' || 
                typeof body.voltage2 !== 'number' || 
                typeof body.current2 !== 'number') {
            return NextResponse.json(
                { error: '数据格式错误，所有字段必须为数字' },
                { status: 400, headers: corsHeaders }
            );
        }

        // 更新数据
        latestData = {
            voltage1: body.voltage1,
            current1: body.current1,
            voltage2: body.voltage2,
            current2: body.current2
        };

        console.log('接收到数据:', latestData);

        return NextResponse.json({
            success: true,
            message: '数据接收成功',
            data: latestData,
            timestamp: new Date().toISOString()
        }, { headers: corsHeaders });

    } catch (error) {
        console.error('API错误:', error);
        return NextResponse.json(
            { error: '服务器内部错误' },
            { status: 500, headers: corsHeaders }
        );
    }
}

// GET 请求 - 获取最新数据
export async function GET() {
    try {
        return NextResponse.json({
            success: true,
            data: latestData,
            timestamp: new Date().toISOString()
        }, { headers: corsHeaders });
    } catch (error) {
        console.error('API错误:', error);
        return NextResponse.json(
            { error: '服务器内部错误' },
            { status: 500, headers: corsHeaders }
        );
    }
}
