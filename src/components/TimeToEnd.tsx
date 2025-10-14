import React, { useEffect, useState } from 'react';
import { Text, View, Dimensions } from 'react-native';
import { COLORS, normaSizes } from '@/constants';

type Props = {
    endTimestamp: {
        formatted: number;
        msg: string;
    }; // timestamp em segundos
    FONTSTYLE: {
        fontSize: number;
        color: string;
    };
    onFinish?: () => void;
};

function formatCountdown(ms: number) {
    if (ms <= 0) return '0d, 00h00m00s';
    const totalSeconds = Math.floor(ms / 1000);
    const days = Math.floor(totalSeconds / (60 * 60 * 24));
    const hours = Math.floor((totalSeconds % (60 * 60 * 24)) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${days}d, ${String(hours).padStart(2, '0')}h${String(minutes).padStart(2, '0')}m${String(seconds).padStart(2, '0')}`;
}

export default function TimeToEnd({ endTimestamp, FONTSTYLE, onFinish }: Props) {
    // Corrigido: timestamp sempre em segundos
    const endMs = endTimestamp.formatted * 1000;
    const [now, setNow] = useState(Date.now());
    const [finished, setFinished] = useState(false);

    useEffect(() => {
        if (finished) return;
        const timer = setInterval(() => {
            setNow(Date.now());
        }, 1000);
        return () => clearInterval(timer);
    }, [finished]);

    useEffect(() => {
        if (now >= endMs && !finished) {
            setFinished(true);
            if (onFinish) onFinish();
        }
    }, [now, endMs, finished, onFinish]);

    const msLeft = Math.max(endMs - now, 0);
    const countdown = formatCountdown(msLeft);

    return (
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', width: '70%' }}>
            {!finished ? (
                <Text style={{ fontWeight: '500', fontSize: normaSizes(FONTSTYLE.fontSize), color: msLeft <= 86400000 ? 'red' : FONTSTYLE.color, fontStyle: 'italic', textAlign: 'center', width: '100%' }}>
                    ⚠️{endTimestamp.msg} {countdown}
                </Text>
            ) : (
                <Text style={{ color: 'red', fontSize: normaSizes(FONTSTYLE.fontSize), textAlign: 'center', fontWeight: 'bold' }}>
                    🛑Prazo encerrado!
                </Text>
            )}
        </View>
    );

}


