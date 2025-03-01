// สร้าง Component สำหรับแสดงข้อมูลรถประจำทางในกรุงเทพ โดยใช้ React, Material-UI และ Recharts
import React from 'react';
import moment from 'moment';
import { ThemeProvider,createTheme } from '@material-ui/core/styles';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import CssBaseline from '@material-ui/core/CssBaseline';
import Container from '@material-ui/core/Container';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import axios from 'axios';
import { ResponsiveContainer, Rectangle, XAxis, YAxis, CartesianGrid, 
  Tooltip, Legend, LineChart, Line, BarChart, Bar } from 'recharts';
import mockupData from './mockup/mockup.json';
import chartsMockupData from './mockup/chartsMockup.json';
import linechartMockupData from './mockup/linechartMockup.json';
import bmta_img from './images/BMTA_Logo.png';
import tsb_img from './images/TSB.png';

const styles = theme => ({
  appBarSpacer: theme.mixins.toolbar,
  title: {
    flexGrow: 1,
  },
  container: {
    fontFamily: 'IBM Plex Sans Thai, sans-serif', // ใช้ฟอนต์ IBM Plex Sans Thai
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  paper: {
    fontFamily: 'IBM Plex Sans Thai, sans-serif', // ใช้ฟอนต์ IBM Plex Sans Thai
    padding: theme.spacing(2),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  footer: {
    backgroundColor: theme.palette.background.paper,
    marginTop: theme.spacing.unit * 2,
  },
  img: {
    width: 40,
    height: 40,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  clk: {
    margin: 0,
  }
});

const theme = createTheme({
  typography: {
    fontFamily: '"IBM Plex Sans Thai", sans-serif',
  },
});

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      databus: mockupData[0],
      chartsData: chartsMockupData,
      linechartsData: linechartMockupData,
      data_text: {
        updatedDate: '',
        confirmed: '',
        hospitalized: '',
        deaths: '',
        recovered: '',
        newConfirmed: '',
        newHospitalized: '',
        newDeaths: '',
        newRecovered: '',
      },
      data_pie: [{}],
      //เพิ่ม state เพื่อเก็บเวลาปัจจุบัน
      currentTime: moment().format('HH:mm:ss'),
    };
  }

  componentDidMount() {
    this.callAPI();
    this.timerID = setInterval(
      () => this.tick(),
      1000
    );
  }

  componentWillUnmount() {
    clearInterval(this.timerID);
  }

  tick() {
    this.setState({
      currentTime: moment().format('HH:mm:ss')
    });
  }

  callAPI() {
    axios.get('')
    .then(response => {
        console.log(response.data);
        const data = response.data['Data'];
        const lastData = data.slice(-1)[0];
        this.setState({
          dataTimeline: data,
          dataTimeline15: data.slice(1).slice(-15),
          data_text: {
            source: response.data['Source'],
            updatedDate: lastData['Date'],
            confirmed: lastData['Confirmed'],
            hospitalized: lastData['Hospitalized'],
            deaths: lastData['Deaths'],
            recovered: lastData['Recovered'],
            newConfirmed: lastData['NewConfirmed'],
            newHospitalized: lastData['NewHospitalized'],
            newDeaths: lastData['NewDeaths'],
            newRecovered: lastData['NewRecovered'],
          },
          data_pie: [
            { name: 'hospitalized', value: lastData['Hospitalized'] },
            { name: 'deaths', value: lastData['Deaths'] },
            { name: 'recovered', value: lastData['Recovered'] },
          ]
        });
        
    })
    .catch(function (error) {
        console.log(error);
    })
  }

  render() {
    const { classes } = this.props;
    const { data_text, databus, currentTime, chartsData, linechartsData } = this.state;
    const currentDate = new Date();
    const formattedDate = moment(currentDate).format('DD/MM/YYYY');
    
    return (
      <ThemeProvider theme={theme}>
        <div className={classes.root}>
          <CssBaseline />
          <AppBar>
            <Toolbar>
              <Typography variant="h6" className={classes.title}>
                สรุปข้อมูลรถประจำทางประจำวัน วันที่ : {formattedDate}
              </Typography>
              {/* เพิ่มนาฬิกาดิจิทัล */}
              <Typography variant="h5" align='right'  className={classes.title}>
                <b>{currentTime}</b>
                <h6 className={classes.clk}>{formattedDate}</h6>
              </Typography>
            </Toolbar>
          </AppBar>
          <div className={classes.appBarSpacer} />
          <Container>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography align="right">
                  Last updated: {formattedDate}
                </Typography>
                <Typography variant="subtitle2" align="right">
                  <a href={data_text.source} target="_blank" rel="noopener noreferrer">{data_text.source}</a>
                </Typography>
              </Grid>
              <Grid item xs={6} sm={4} className={classes.grid}>
                <Paper className={classes.paper}>
                  <Typography variant="h6">รถประจำทางทั้งหมด</Typography>
                  <Typography variant="subtitle1"> จำนวนทั้งหมด : {databus.total_bus.total_bus_num} คัน</Typography>
                  <Typography variant="subtitle1" align='center'>
                    <img className={classes.img} src={bmta_img} alt="BMTA" />
                    ขสมก. : {databus.total_bus.BMTA} คัน
                  </Typography>
                  <Typography variant="subtitle1">
                    <img className={classes.img} src={tsb_img} alt="TSB"/>
                    ไทยสมายล์บัส : {databus.total_bus.TSB} คัน</Typography>
                </Paper>
              </Grid>
              <Grid item xs={6} sm={4}>
                <Paper className={classes.paper}>
                  <Typography variant="h6">รถที่วิ่งเต็มระยะทาง</Typography>
                  <Typography variant="subtitle1"> จำนวนทั้งหมด : {databus.bus_full_distance.total_bus_num} คัน</Typography>
                  <Typography variant="subtitle1">
                    <img className={classes.img} src={bmta_img} alt="BMTA" /> 
                    ขสมก. : {databus.bus_full_distance.BMTA} คัน
                  </Typography>
                  <Typography variant="subtitle1">
                    <img className={classes.img} src={tsb_img} alt="TSB" width="20" height="20" />
                    ไทยสมายล์บัส : {databus.bus_full_distance.TSB} คัน
                  </Typography>
                </Paper>
              </Grid>
              <Grid item xs={6} sm={4}>
                <Paper className={classes.paper}>
                  <Typography variant="h6">รถที่ตัดเสริมหรือหมดระยะ</Typography>
                  <Typography variant="subtitle1"> จำนวนทั้งหมด : {databus.bus_extra.total_bus_num} คัน</Typography>
                  <Typography variant="subtitle1">
                    <img className={classes.img} src={bmta_img} alt="BMTA" />
                    ขสมก. : {databus.bus_extra.BMTA} คัน</Typography>
                  <Typography variant="subtitle1">
                    <img className={classes.img} src={tsb_img} alt="TSB" width="20" height="20" />
                    ไทยสมายล์บัส : {databus.bus_extra.TSB} คัน</Typography>
                </Paper>
              </Grid>
              {/* <Grid item xs={6} sm={3}>
                <Paper className={classes.paper}>
                  <Typography>Recovered</Typography>
                  <Typography variant="h3">{data_text.recovered.toLocaleString()}</Typography>
                  <Typography variant="h5">({data_text.newRecovered.toLocaleString()})</Typography>
                </Paper>
              </Grid> */}
              <Grid item xs={12} sm={12}>
                <Paper className={classes.paper}>
                  <ResponsiveContainer width="100%" height={300}>
                  <BarChart 
                      width={500} 
                      height={300} 
                      data={chartsData}
                      margin={{top: 5, right: 5, left: 0, bottom: 5}}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="full_dis" activeBar={<Rectangle fill="pink" stroke="blue" />}fill="#8884d8" />
                      <Bar dataKey="extra" activeBar={<Rectangle fill="gold" stroke="purple" />}fill="#FF9AA2" />
                    </BarChart>
                  </ResponsiveContainer>
                </Paper>
              </Grid>
              
              <Typography variant="h4"><b>- ประวัติข้อมูล 7 วันหลังสุด</b></Typography>

              <Grid container spacing={2}>
                {Object.keys(linechartsData[0]).map((lineName, index) => (
                  <Grid item xs={12} key={index}>
                    <Paper className={classes.paper}>
                      <Typography variant="h5">
                        <b>สายที่ {lineName}</b>
                      </Typography>
                      <ResponsiveContainer width="100%" height={500}>
                        <LineChart
                          data={linechartsData[0][lineName]}
                          margin={{ top: 5, right: 5, left: 0, bottom: 5 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="Date" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Line type="monotone" dataKey="full_dis" stroke="blue" activeDot={{ r: 8 }} />
                          <Line type="monotone" dataKey="extra" stroke="red" activeDot={{ r: 8 }} />
                        </LineChart>  
                      </ResponsiveContainer>
                    </Paper>
                  </Grid>
                ))}
              </Grid>

            </Grid>
          </Container>
          <footer className={classes.footer}>
            <Paper className={classes.paper}>
              <Typography variant="h6">
                React App with Material UI & Recharts for Bangkok Bus Dashboard
              </Typography>
              <Typography component="p">
                Source code by Sirawit and Pasathon
              </Typography>
            </Paper>
          </footer>
        </div>
      </ThemeProvider>
    );
  }
}

export default withStyles(styles)(App);