import React from 'react';
import './App.css';
import { useMutation } from '@apollo/client';
import queries from '../queries';
import { Card, CardContent, CardMedia, Grid, Typography, makeStyles, createTheme, ThemeProvider, Container } from '@material-ui/core';
import DeleteButton from './DeleteButton';

const theme = createTheme({
    typography: {
      fontFamily: [
        '-apple-system',
        'BlinkMacSystemFont',
        '"Roboto Mono"',
        '"Segoe UI"',
        '"Helvetica Neue"',
        'Arial',
        'sans-serif',
        '"Apple Color Emoji"',
        '"Segoe UI Emoji"',
        '"Segoe UI Symbol"',
      ].join(',')
    },
  });

const useStyles = makeStyles({
	card: {
		maxWidth: '80%',
		height: 'auto',
		marginLeft: 'auto',
		marginRight: 'auto',
		boxShadow: '0 19px 38px rgba(0,0,0,0.30), 0 15px 12px rgba(0,0,0,0.22);',
	},
	titleHead: {
		fontWeight: 'bold'
	},
	grid: {
		flexGrow: 1,
		flexDirection: 'column',
        alignItems: 'center',
        justify: 'center'
	},
	media: {
		height: '100%',
		width: '100%'
	}
});



function List (props){
    const classes = useStyles();
    
    const [updateImage] = useMutation(queries.UPDATE_IMAGE);

    const addToBin = (imagePost) =>{
        updateImage({
          variables:{
            id: imagePost.id,
            url : imagePost.url,
            description: imagePost.description,
            posterName: imagePost.posterName,
            userPosted: imagePost.userPosted,
            binned: true
          }
        });
      };
      const delFromBin = (imagePost) => {
        updateImage({
            variables: {
            id: imagePost.id,
            url : imagePost.url,
            description: imagePost.description,
            posterName: imagePost.posterName,
            userPosted: imagePost.userPosted,
            binned:false
            }
        });
      };

    const buildCard = (imagePost) => {
		return (
			<Grid item xs={12} sm={12} md={8} lg={7} xl={7} key={imagePost.id}>
				<Card className={classes.card} variant='outlined'>
					

                    <CardMedia
                        className={classes.media}
                        component='img'
                        image={imagePost.url}
                        title={imagePost.description}
                    />

                    <CardContent>
                        { (imagePost.description !== "N/A") &&
                        <Typography className={classes.titleHead} gutterBottom variant='h6' component='h3'>
                            {imagePost.description}
                        </Typography>
                        }
                        
                        <Typography variant='body2' color='textSecondary' component='p'>
                            {"an image by: "+imagePost.posterName}
                        </Typography>
                    </CardContent>

                    <br />
                    { imagePost.binned === true ?
                    <button className='post-button' onClick={() => {delFromBin(imagePost)}}> 
                        remove from bin 
                    </button>:
                    <button className='post-button' onClick={() => {addToBin(imagePost);}}> 
                        add to bin 
                    </button> 
                    }
                    
                    <br />
                    { props.delete &&  
                    <DeleteButton id={imagePost.id} />
                    }
					<br />
				</Card>
			</Grid>
		);
	};
    let card = "";
    

    if (Array.isArray(props.data) && props.data.length > 0){
        card = props.data.map( (imagePost) => {return buildCard(imagePost)} );
        return(
            <ThemeProvider theme={theme}>
                <Container>
                    <Grid container className={classes.grid} spacing={5} >
                        {card}
                    </Grid>
                </Container>
            </ThemeProvider>
            
        );
    }else{
        return(
            <div>no entries found!</div>
        )
    }

    


}

export default List;
