import React from "react";
import styled from "@emotion/styled";
import GoogleMapReact, { Maps } from "google-map-react";

import { CardContent, Card as MuiCard, Typography } from "@mui/material";
import { spacing } from "@mui/system";

const Card = styled(MuiCard)(spacing);

const Spacer = styled.div(spacing);

const GoogleMapReactWrapper = styled.div`
  height: 300px;
  width: 100%;
`;

function Markers() {
  const options = {
    center: {
      lat: 40.712784,
      lng: -74.005941,
    },
    zoom: 14,
  };

  const getMapOptions = (maps: Maps) => {
    return {
      fullscreenControl: true,
      mapTypeControl: true,
      mapTypeId: maps.MapTypeId.ROADMAP,
      scaleControl: true,
      scrollwheel: false,
      streetViewControl: true,
    };
  };

  const renderMarkers = (map: any, maps: any) => {
    new maps.Marker({
      position: {
        lat: 40.712784,
        lng: -74.005941,
      },
      map,
      title: "Hello World!",
    });
  };

  return (
    <Card mb={1}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Markers
        </Typography>
        <Typography variant="body2" gutterBottom>
          Identify a location on a map.
        </Typography>

        <Spacer mb={6} />

        <GoogleMapReactWrapper>
          <GoogleMapReact
            options={getMapOptions}
            bootstrapURLKeys={{
              key: "AIzaSyA-aWrwgr64q4b3TEZwQ0lkHI4lZK-moM4",
            }}
            defaultCenter={options.center}
            defaultZoom={options.zoom}
            onGoogleApiLoaded={({ map, maps }) => renderMarkers(map, maps)}
          />
        </GoogleMapReactWrapper>
      </CardContent>
    </Card>
  );
}

export default Markers;
