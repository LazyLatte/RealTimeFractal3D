import {FC, ReactNode} from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
interface OptionProps {
    label: string, 
    children: ReactNode
};
const Option: FC<OptionProps> = ({label, children}) => {
    return (
        <Box display="flex" flexDirection="row" justifyContent="flex-start" alignItems="center" >
            <Typography sx={{margin: "0 12px"}}>{label}</Typography>
            {children}
        </Box>
    )
}

export default Option;