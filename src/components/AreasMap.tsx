import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { AgricultureArea } from '../types/agricultureArea';
import { riskColors } from '../theme/colors';
import { useThemeMode } from '../hooks/useThemeMode';
import { formatCoordinate } from '../utils/coordinates';

type AreasMapProps = {
  areas: AgricultureArea[];
  selectedAreaId?: string;
  onSelectArea: (area: AgricultureArea) => void;
};

function normalizePosition(value: number, min: number, max: number): number {
  if (max === min) {
    return 50;
  }

  return ((value - min) / (max - min)) * 78 + 11;
}

export function AreasMap({ areas, selectedAreaId, onSelectArea }: AreasMapProps) {
  const { colors } = useThemeMode();

  if (!areas.length) {
    return (
      <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <View style={[styles.emptyMap, { backgroundColor: colors.surfaceAlt, borderColor: colors.border }]}>
          <Text style={[styles.emptyTitle, { color: colors.text }]}>Nenhuma area no mapa</Text>
          <Text style={[styles.emptyText, { color: colors.muted }]}>
            Altere o filtro ou a busca para visualizar outras regioes.
          </Text>
        </View>
      </View>
    );
  }

  const latitudes = areas.map((area) => area.coordinates.latitude);
  const longitudes = areas.map((area) => area.coordinates.longitude);
  const minLatitude = Math.min(...latitudes);
  const maxLatitude = Math.max(...latitudes);
  const minLongitude = Math.min(...longitudes);
  const maxLongitude = Math.max(...longitudes);
  const selectedArea = areas.find((area) => area.id === selectedAreaId) ?? areas[0];

  return (
    <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <View style={[styles.map, { backgroundColor: colors.surfaceAlt, borderColor: colors.border }]}>
        <View style={[styles.verticalGuide, { backgroundColor: colors.border }]} />
        <View style={[styles.horizontalGuide, { backgroundColor: colors.border }]} />

        {areas.map((area) => {
          const left = normalizePosition(area.coordinates.longitude, minLongitude, maxLongitude);
          const top = 100 - normalizePosition(area.coordinates.latitude, minLatitude, maxLatitude);
          const active = selectedAreaId === area.id;

          return (
            <Pressable
              key={area.id}
              onPress={() => onSelectArea(area)}
              style={({ pressed }) => [
                styles.pin,
                {
                  left: `${left}%` as `${number}%`,
                  top: `${top}%` as `${number}%`,
                  backgroundColor: riskColors[area.risk.level],
                  borderColor: active ? colors.text : colors.card,
                  transform: [{ scale: active ? 1.24 : pressed ? 1.08 : 1 }],
                },
              ]}
            />
          );
        })}
      </View>

      {selectedArea && (
        <View style={styles.selectedInfo}>
          <View style={styles.selectedTitleRow}>
            <Text style={[styles.selectedTitle, { color: colors.text }]} numberOfLines={1}>
              {selectedArea.name}
            </Text>
            <Text style={[styles.selectedRisk, { color: riskColors[selectedArea.risk.level] }]}>
              {selectedArea.risk.level}
            </Text>
          </View>
          <Text style={[styles.selectedMeta, { color: colors.muted }]}>
            {selectedArea.city}, {selectedArea.state} | Lat {formatCoordinate(selectedArea.coordinates.latitude)} | Lon{' '}
            {formatCoordinate(selectedArea.coordinates.longitude)}
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 14,
    gap: 12,
  },
  map: {
    height: 220,
    borderWidth: 1,
    borderRadius: 8,
    overflow: 'hidden',
  },
  verticalGuide: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: '50%',
    width: 1,
  },
  horizontalGuide: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: '50%',
    height: 1,
  },
  pin: {
    position: 'absolute',
    width: 22,
    height: 22,
    marginLeft: -11,
    marginTop: -11,
    borderRadius: 11,
    borderWidth: 3,
  },
  selectedInfo: {
    gap: 5,
  },
  selectedTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  selectedTitle: {
    flex: 1,
    fontSize: 15,
    fontWeight: '900',
  },
  selectedRisk: {
    fontSize: 12,
    fontWeight: '900',
  },
  selectedMeta: {
    fontSize: 12,
    lineHeight: 18,
    fontWeight: '700',
  },
  emptyMap: {
    minHeight: 160,
    borderWidth: 1,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 18,
    gap: 8,
  },
  emptyTitle: {
    fontSize: 15,
    fontWeight: '900',
    textAlign: 'center',
  },
  emptyText: {
    fontSize: 13,
    lineHeight: 19,
    textAlign: 'center',
  },
});
