// export const COLUMNS = () => [
//   {
//     Header: 'Device ID',
//     accessor: 'deviceId',
//   },
//   {
//     Header:'type',
    
//   }
// ];
// export const COLUMNS = () => [
//   {
//     Header: 'ID',
//     accessor: 'id',
//   },
//   {
//     Header: 'Device ID',
//     accessor: 'deviceId',
//   },
//   {
//     Header: 'Protocol',
//     accessor: 'protocol',
//   },
//   {
//     Header: 'Server Time',
//     accessor: 'serverTime',
//   },
//   {
//     Header: 'Device Time',
//     accessor: 'deviceTime',
//   },
//   {
//     Header: 'Fix Time',
//     accessor: 'fixTime',
//   },
//   {
//     Header: 'Outdated',
//     accessor: 'outdated',
//   },
//   {
//     Header: 'Valid',
//     accessor: 'valid',
//   },
//   {
//     Header: 'Latitude',
//     accessor: 'latitude',
//   },
//   {
//     Header: 'Longitude',
//     accessor: 'longitude',
//   },
//   {
//     Header: 'Altitude',
//     accessor: 'altitude',
//   },
//   {
//     Header: 'Speed',
//     accessor: 'speed',
//   },
//   {
//     Header: 'Course',
//     accessor: 'course',
//   },
//   {
//     Header: 'Address',
//     accessor: 'address',
//   },
//   {
//     Header: 'Accuracy',
//     accessor: 'accuracy',
//   },
//   {
//     Header: 'Network Radio Type',
//     accessor: row => row.network.radioType,
//   },
//   {
//     Header: 'Network Consider IP',
//     accessor: row => row.network.considerIp,
//   },
//   {
//     Header: 'Geofence IDs',
//     accessor: row => row.geofenceIds.join(', '),
//   },
//   {
//     Header: 'Satellite',
//     accessor: 'attributes.sat',
//   },
//   {
//     Header: 'Ignition',
//     accessor: 'attributes.ignition',
//   },
//   {
//     Header: 'Event',
//     accessor: 'attributes.event',
//   },
//   {
//     Header: 'Archive',
//     accessor: 'attributes.archive',
//   },
//   {
//     Header: 'Odometer',
//     accessor: 'attributes.odometer',
//   },
//   {
//     Header: 'Distance',
//     accessor: 'attributes.distance',
//   },
//   {
//     Header: 'Total Distance',
//     accessor: 'attributes.totalDistance',
//   },
//   {
//     Header: 'Motion',
//     accessor: 'attributes.motion',
//   },
//   {
//     Header: 'Charge',
//     accessor: 'attributes.charge',
//   },
//   {
//     Header: 'Hours',
//     accessor: 'attributes.hours',
//   },
// ];


export const COLUMNS = () => [
  // {
  //   Header: 'ID',
  //   accessor: 'id',
  // },
  // {
  //   Header: 'Device ID',
  //   accessor: 'deviceId',
  // },
  {
    Header: 'device Name',
    accessor: 'deviceName',
  },
  {
    Header: 'Total Distance',
    accessor: 'sumDistance',
  },
  {
    Header: 'start Time',
    accessor: 'startTime',
  },
  {
    Header: 'end Time',
    accessor: 'endTime',
  },
  {
    Header: 'start Latitude',
    accessor: 'startLatitude',
  },

  {
    Header: 'start Longitude',
    accessor: 'startLongitude',
  },
  {
    Header: 'end Latitude',
    accessor: 'endLatitude',
  },
  {
    Header: 'end Longitude',
    accessor: 'endLongitude',
  },
  {
    Header: 'Average Speed',
    accessor: 'avgSpeed',
  },
 
 
  

  
];


  